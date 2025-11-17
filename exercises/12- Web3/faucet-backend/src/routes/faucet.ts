import express, { type Request, type Response } from 'express';
import { faucetContract } from '../config/web3';
import type { ClaimResponse, FaucetStatus } from '../types';
import { ethers } from 'ethers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /faucet/claim - Reclamar tokens (protegido)
router.post('/claim', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userAddress = req.user!.address;

        console.log(`Faucet claim requested by ${userAddress}`);

        // Verficiar si ya reclamo tokens recientemente
        if (!faucetContract || !faucetContract.hasAddressClaimed) {
            return res.status(500).json({ error: 'Faucet contract not available' });
        }
        const hasClaimed = await faucetContract.hasAddressClaimed(userAddress);

        if (hasClaimed) {
            return res.status(400).json({ 
                error: 'Already claimed',
                message: 'This address has already claimed tokens recently' 
            });
        }

        // Ejecutar transacción para reclamar tokens
        const tx = await faucetContract.claimTokens();
        console.log(`📝 Transaction sent: ${tx.hash}`);

        // Esperar confirmación
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed: ${receipt?.hash}`);

        const response: ClaimResponse = {
            txHash: receipt?.hash || tx.hash,
            success: true,
            message: 'Tokens claimed successfully'
        }

        res.json(response);
    } catch (error: any) {
        console.error('Error processing faucet claim:', error);

        let errorMessage = 'Failed to claim tokens'
        if (error.message?.includes('revert')) {
            errorMessage = 'Smart contract reverted the transaction - you may have already claimed recently'; 
        } else if (error.message?.includes('gas')) {
            errorMessage = 'Transaction failed due to gas issues';
        }

        res.status(500).json({ 
            error: 'Faucet claim failed',
            message: errorMessage,
            details: error.message || error.toString()
        });
    }
})

// GET /faucet/status/:address - Obtener estado del faucet (protegido)
router.get('/status/:address', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('Received /faucet/status request with params:', req.params.address);

        console.log('Authenticated user:', req.user);

        const { address }: any = req.params;
        const userAddress = req.user!.address;

        console.log(`Checking status for address: ${address} by user: ${userAddress}`);

        if (!address) {
            return res.status(400).json({ 
                error: 'Missing address',
                message: 'Address parameter is required' 
            });
        }

        // Verfificar que el usuario solo consulte su propia dirección
        if (address.toLowerCase() !== userAddress.toLowerCase()) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: 'You can only check the status of your own address' 
            });
        }

        if (!ethers.isAddress(address)) {
            return res.status(400).json({
                error: 'Invalid address',
                message: 'The provided address is not a valid Ethereum address'
            });
        }

        console.log(`📊 Getting faucet status for ${address}`);

        // Consultas en paraleleo para mejorar performance
        const [hasClaimed, balance, users, faucetAmount] = await Promise.all([
            faucetContract.hasAddressClaimed(address),
            faucetContract.balanceOf(address),
            faucetContract.getFaucetUsers(),
            faucetContract.getFaucetAmount()
        ]);

        console.log(`Status for ${address} - Has claimed: ${hasClaimed}, Balance: ${ethers.formatUnits(balance, 18)}`);
        console.log(`Faucet users: ${users}`);
        console.log(`Faucet amount: ${ethers.formatUnits(faucetAmount, 18)}`);

        const response: FaucetStatus = {
            hasClaimed,
            balance: ethers.formatUnits(balance, 18), // Asumiendo 18 decimales
            // users: users.map((addr: string) => addr.toLowerCase()),
            users: [], // Omitido para simplificar
            // faucetAmount: ethers.formatUnits(faucetAmount, 18)
            faucetAmount: '10' // Hardcodeado para simplificar
        }

        res.json(response);
    } catch (error: any) {
        console.error('Error getting faucet status:', error);
        res.status(500).json({
            error: 'Failed to get faucet status',
            message: 'Internal server error',
            details: error.message || error.toString()
        });
    }
});

// GET /faucet/info - Información general del faucet (público)
router.get('/info', async (req: Request, res: Response) => {
    try {
        const [users, faucetAmount] = await Promise.all([
            faucetContract.getFaucetUsers(),
            faucetContract.getFaucetAmount()
        ]);

        res.json({
            totalUsers: users.length,
            faucetAmount: ethers.formatUnits(faucetAmount, 18),
            contractAddress: process.env.CONTRACT_ADDRESS 
        })
    } catch (error: any) {
        console.error('Error getting faucet info:', error);
        res.status(500).json({
            error: 'Failed to get faucet info',
            message: 'Internal server error',
            details: error.message || error.toString()
        });
    }
});

export default router;