import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { SiweMessage, generateNonce } from 'siwe';
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { faucetTokenAbi } from './abi.js';

const {
  PORT = 4000,
  PRIVATE_KEY,
  JWT_SECRET,
  RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com',
  CONTRACT_ADDRESS,
  CORS_ORIGINS,
  SIWE_STATEMENT = 'Inicia sesion para usar el faucet seguro',
  FRONTEND_URL = 'http://localhost:5173'
} = process.env;

if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY is required');
}
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
if (!CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS is required');
}

const normalizedKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
const account = privateKeyToAccount(normalizedKey);

const transport = http(RPC_URL);
const publicClient = createPublicClient({ chain: sepolia, transport });
const walletClient = createWalletClient({ account, chain: sepolia, transport });

const pendingMessages = new Map();
const MESSAGE_TTL = 5 * 60 * 1000; // 5 minutes

function cleanupPendingMessages() {
  const now = Date.now();
  for (const [nonce, entry] of pendingMessages.entries()) {
    if (entry.expiresAt <= now) {
      pendingMessages.delete(nonce);
    }
  }
}

setInterval(cleanupPendingMessages, 60 * 1000);

const app = express();

const allowedOrigins = CORS_ORIGINS
  ? CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : '*';

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/auth/message', (req, res) => {
  const { address, chainId } = req.body ?? {};

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'address is required' });
  }
  if (!chainId || Number(chainId) !== sepolia.id) {
    return res.status(400).json({ error: 'Solo se admite Sepolia (chainId 11155111)' });
  }

  const nonce = generateNonce();
  const domain = new URL(FRONTEND_URL).hostname;
  const statement = `${SIWE_STATEMENT}`;

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: FRONTEND_URL,
    version: '1',
    chainId,
    nonce
  });

  const preparedMessage = message.prepareMessage();
  pendingMessages.set(nonce, {
    address: address.toLowerCase(),
    message: preparedMessage,
    expiresAt: Date.now() + MESSAGE_TTL
  });

  res.json({ token: nonce, address, message: preparedMessage });
});

app.post('/auth/signin', async (req, res) => {
  const { token, signature } = req.body ?? {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token is required' });
  }
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ error: 'signature is required' });
  }

  const stored = pendingMessages.get(token);
  if (!stored) {
    return res.status(400).json({ error: 'Token invalido o expirado' });
  }
  if (stored.expiresAt <= Date.now()) {
    pendingMessages.delete(token);
    return res.status(400).json({ error: 'Token expirado' });
  }

  try {
    const siweMessage = new SiweMessage(stored.message);
    await siweMessage.verify({
      signature,
      domain: siweMessage.domain,
      nonce: token
    });

    const address = siweMessage.address.toLowerCase();
    if (address !== stored.address) {
      return res.status(400).json({ error: 'La direccion firmante no coincide' });
    }

    pendingMessages.delete(token);

    const jwtToken = jwt.sign({ sub: address, address }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token: jwtToken, address });
  } catch (error) {
    return res.status(400).json({ error: 'Firma invalida' });
  }
});

function authenticate(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [kind, value] = header.split(' ');
  if (kind !== 'Bearer' || !value) {
    return res.status(401).json({ error: 'Token faltante' });
  }

  try {
    const payload = jwt.verify(value, JWT_SECRET);
    if (typeof payload !== 'object' || !payload || !payload.address) {
      return res.status(401).json({ error: 'Token invalido' });
    }

    req.user = { address: String(payload.address).toLowerCase(), token: value };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido' });
  }
}

app.post('/faucet/claim', authenticate, async (req, res) => {
  const userAddress = req.user.address;

  try {
    const hasClaimed = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: faucetTokenAbi,
      functionName: 'hasAddressClaimed',
      args: [userAddress]
    });

    if (hasClaimed) {
      return res
        .status(400)
        .json({ success: false, error: 'La direccion ya reclamo tokens' });
    }

    const hash = await walletClient.writeContract({
      account,
      address: CONTRACT_ADDRESS,
      abi: faucetTokenAbi,
      functionName: 'claimTokens'
    });

    await publicClient.waitForTransactionReceipt({ hash });

    res.json({ success: true, txHash: hash });
  } catch (error) {
    console.error('Error en /faucet/claim', error);
    res.status(500).json({ success: false, error: 'No se pudo procesar el reclamo' });
  }
});

app.get('/faucet/status/:address', authenticate, async (req, res) => {
  const requested = req.params.address?.toLowerCase();
  const tokenAddress = req.user.address?.toLowerCase();

  if (!requested || requested !== tokenAddress) {
    return res
      .status(403)
      .json({ error: 'No autorizado para consultar esta direccion' });
  }

  try {
    const [hasClaimed, balance, faucetAmount, users] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'hasAddressClaimed',
        args: [requested]
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'balanceOf',
        args: [requested]
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'getFaucetAmount'
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'getFaucetUsers'
      })
    ]);

    res.json({
      hasClaimed,
      balance: balance.toString(),
      faucetAmount: faucetAmount.toString(),
      users
    });
  } catch (error) {
    console.error('Error en /faucet/status', error);
    res.status(500).json({ error: 'No se pudo obtener el estado del faucet' });
  }
});

app.get('/faucet/info', authenticate, async (_req, res) => {
  try {
    const [name, symbol, decimals, faucetAmount] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'name'
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'symbol'
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'decimals'
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: faucetTokenAbi,
        functionName: 'getFaucetAmount'
      })
    ]);

    res.json({
      name,
      symbol,
      decimals: Number(decimals),
      faucetAmount: faucetAmount.toString()
    });
  } catch (error) {
    console.error('Error en /faucet/info', error);
    res
      .status(500)
      .json({ error: 'No se pudo obtener la informacion del token' });
  }
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(Number(PORT), () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
