import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { SiweMessage, generateNonce } from 'siwe'
import { z } from 'zod'
import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
  formatUnits
} from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const {
  PORT = 3001,
  FRONTEND_ORIGIN = 'http://localhost:5173',
  RPC_URL,
  CONTRACT_ADDRESS,
  JWT_SECRET,
  PRIVATE_KEY,
  SERVER_MINT
} = process.env

// --- Viem clients ---
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL)
})

let walletClient = null
let ownerAccount = null
if (PRIVATE_KEY) {
  ownerAccount = privateKeyToAccount(PRIVATE_KEY)
  walletClient = createWalletClient({
    account: ownerAccount,
    chain: sepolia,
    transport: http(RPC_URL)
  })
}

// --- ABI mínimo del FaucetToken ---
const faucetAbi = [
  { type: 'function', name: 'claimTokens', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'hasAddressClaimed', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'getFaucetUsers', stateMutability: 'view', inputs: [], outputs: [{ type: 'address[]' }] },
  { type: 'function', name: 'getFaucetAmount', stateMutability: 'pure', inputs: [], outputs: [{ type: 'uint256' }] },
  // ERC20
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'mint', stateMutability: 'nonpayable', inputs: [{ name:'to', type:'address' }, { name:'amount', type:'uint256' }], outputs: [] }
]

// --- App ---
const app = express()
app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json())

// Mem-stores simples (demo)
const nonces = new Map()          // address -> nonce
const claimedDB = new Set()       // sólo para Modo B (si minteás desde el server)
const usersDB = new Set()         // espejo básico (demo)

function signJwt(address) {
  return jwt.sign({ sub: address, address }, JWT_SECRET, { expiresIn: '1h' })
}

function auth(req, res, next) {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : h
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    res.status(401).json({ error: 'invalid_or_expired_token' })
  }
}

// --- Schemas ---
const messageReq = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.number().default(11155111)
})

const signinReq = z.object({
  message: z.string(),
  signature: z.string()
})

// --- Auth: obtener mensaje SIWE ---
app.post('/auth/message', (req, res) => {
  const parse = messageReq.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'bad_request' })

  const { address, chainId } = parse.data
  const nonce = generateNonce()
  nonces.set(address.toLowerCase(), nonce)

  const domain = new URL(FRONTEND_ORIGIN).host
  const msg = new SiweMessage({
    domain,
    address,
    statement: 'Sign-In with Ethereum to the Faucet.',
    uri: FRONTEND_ORIGIN,
    version: '1',
    chainId,
    nonce
  })

  // La consigna pide { token, address } — te devuelvo ambos + el texto legible
  res.json({ token: nonce, address, message: msg.prepareMessage() })
})

// --- Auth: validar firma SIWE y emitir JWT ---
app.post('/auth/signin', async (req, res) => {
  const parse = signinReq.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'bad_request' })

  const { message, signature } = parse.data
  try {
    const domain = new URL(FRONTEND_ORIGIN).host
    const msg = new SiweMessage(message)
    const addrLower = msg.address.toLowerCase()
    const expectedNonce = nonces.get(addrLower)

    const { success } = await msg.verify({ signature, domain, nonce: expectedNonce })
    if (!success) return res.status(401).json({ error: 'siwe_verification_failed' })

    nonces.delete(addrLower)
    const token = signJwt(addrLower)
    res.json({ token, address: addrLower })
  } catch (err) {
    res.status(401).json({ error: 'siwe_invalid' })
  }
})

// --- Faucet: status protegido ---
app.get('/faucet/status/:address', auth, async (req, res) => {
  try {
    const address = req.params.address.toLowerCase()
    // Lecturas on-chain
    const [hasOnChain, balance, users, name, symbol, decimals, faucetAmount] =
      await Promise.all([
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'hasAddressClaimed', args: [address] }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'balanceOf', args: [address] }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'getFaucetUsers' }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'name' }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'symbol' }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'decimals' }),
        publicClient.readContract({ address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'getFaucetAmount' }),
      ])

    // Para Modo B, combinás on-chain con tu DB
    const hasClaimed = hasOnChain || claimedDB.has(address)
    const usersAll = Array.from(new Set([...(users || []), ...Array.from(usersDB)]))

    res.json({
      hasClaimed: Boolean(hasClaimed),
      balance: formatUnits(balance, Number(decimals)),
      users: usersAll,
      token: { name, symbol, decimals: Number(decimals), faucetAmount: formatUnits(faucetAmount, Number(decimals)) }
    })
  } catch (e) {
    res.status(500).json({ error: 'status_failed' })
  }
})

// --- Faucet: claim protegido ---
app.post('/faucet/claim', auth, async (req, res) => {
  const user = req.user.address.toLowerCase()

  // MODO A (compatible con contrato actual): el server devuelve la calldata y el front envía la TX
  if (!SERVER_MINT) {
    const data = encodeFunctionData({ abi: faucetAbi, functionName: 'claimTokens', args: [] })
    usersDB.add(user)
    return res.json({
      mode: 'client_sends_tx',
      txRequest: { to: CONTRACT_ADDRESS, data, chainId: sepolia.id, value: '0x0' },
      success: true
    })
  }

  // MODO B (opcional): el server mintea al usuario si es owner (PRIVATE_KEY del owner)
  try {
    if (!walletClient || !ownerAccount) {
      return res.status(400).json({ error: 'server_wallet_not_configured' })
    }
    const amount = await publicClient.readContract({
      address: CONTRACT_ADDRESS, abi: faucetAbi, functionName: 'getFaucetAmount'
    })
    // mint(to, amount) - onlyOwner
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: faucetAbi,
      functionName: 'mint',
      args: [user, amount]
    })
    await publicClient.waitForTransactionReceipt({ hash })
    claimedDB.add(user)
    usersDB.add(user)
    res.json({ mode: 'server_mints', txHash: hash, success: true })
  } catch (e) {
    res.status(500).json({ error: 'claim_failed' })
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
