import express, { type Request, type Response } from 'express';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import type { AuthMessage, AuthResponse, SignInRequest } from '../types';
import { ethers } from 'ethers';

const router = express.Router();

// Store temporal para nonces
const nonceStore = new Map<string, { nonce: string; timestamp: number }>();

// Limpiar nonces expirados cada 15 minutos
setInterval(() => {
    const now = Date.now();
    for (const [address, { timestamp }] of nonceStore.entries()) { // sino usar solo nonceStore
        if (now - timestamp > 15 * 60 * 1000) { // 15 minutos
            nonceStore.delete(address);
        }
    }
}, 15 * 60 * 1000);

// POST /auth/message - Generar mensaje SIWE
router.post('/message', (req: Request, res: Response) => {
    try {
        const { address } = req.body;
        
        if (!address || !ethers.isAddress(address)) {
            return res.status(400).json({ 
                error: 'Invalid address',
                message: 'Please provide a valid Ethereum address' 
            });
        }

        const domain = req.get('host') || 'localhost:3001';
        const origin = `http://${domain}`;
        const nonce = ethers.hexlify(ethers.randomBytes(16))

        // guardar nonce temporalmente
        nonceStore.set(address.toLowerCase(), { nonce, timestamp: Date.now() });

        const siweMessage = new SiweMessage({
            domain,
            address,
            statement: 'Sign in to Faucet Token DApp',
            uri: origin,
            version: '1',
            chainId: 11155111, // Sepolia
            nonce,
            issuedAt: new Date().toISOString(),
            expirationTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
        });

        const message = siweMessage.prepareMessage();

        const response: AuthMessage = { 
            message,
            address: address.toLowerCase(),
            nonce
        };

        res.json(response);
    } catch (error) {
        console.error('Error generating SIWE message:', error);
        res.status(500).json({ 
            error: 'Failed to generate SIWE message',
            message: 'Internal Server Error' 
        });
    }
})

//POST /auth/signin - Verificar firma y generar JWT
router.post('/signin', async (req: Request, res: Response) => {
    try {
        console.log('Received /auth/signin request with body:', req.body);

        const { message, signature } = req.body as SignInRequest;

        if (!message || !signature) {
            return res.status(400).json({ 
                error: 'Missing parameters',
                message: 'Both message and signature are required' 
            });
        }

        // Parsear mensaje SIWE
        const siweMessage = new SiweMessage(message);
        const address = siweMessage.address.toLowerCase();

        // Verificar nonce
        const storedData = nonceStore.get(address);

        if (!storedData) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Nonce not found or expired'
            });
        }
        if (storedData.nonce !== siweMessage.nonce) {
            return res.status(400).json({
                error: 'Invalid nonce',
                message: 'The nonce does not match the stored value'
            });
        }

        // Verificar firma
        const result = await siweMessage.verify({ signature });

        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid signature',
                message: 'The provided signature is invalid'
            });
        }

        // Eliminar nonce usado
        nonceStore.delete(address);

        // Crear JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'JWT secret is not defined'
            });
        }
        const token = jwt.sign(
            { address },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24).toISOString(); // 24 horas

        const response: AuthResponse = {
            token,
            address,
            expiresAt
        };

        res.json(response);
    } catch (error) {
        console.error('Error in /auth/signin:', error);
        res.status(400).json({
            error: 'Sign in failed',
            message: 'The provided signature is invalid or the message has expired'
        });
    }
});

export default router;
