import { Request, Response } from 'express';
import { createWalletClient, http, publicActions, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { CONFIG } from '../config';
import { AuthRequest } from '../middleware/auth';
import { db } from '../db';

const FAUCET_ABI = [
    {
        inputs: [],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [{ name: "", type: "address" }],
        name: "hasAddressClaimed",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getFaucetUsers",
        outputs: [{ name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getFaucetAmount",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function"
    },
    {
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function"
    }
] as const;

const account = privateKeyToAccount(CONFIG.PRIVATE_KEY);
const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(CONFIG.RPC_URL)
}).extend(publicActions);

export const getStatus = async (req: AuthRequest, res: Response) => {
    const userAddress = req.params.address as `0x${string}`;
    try {
        const hasClaimedContract = await client.readContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'hasAddressClaimed',
            args: [userAddress]
        });

        const hasClaimedDb = db.hasClaimed(userAddress);
        const hasClaimed = hasClaimedContract || hasClaimedDb;

        const balance = await client.readContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'balanceOf',
            args: [userAddress]
        });

        const users = await client.readContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'getFaucetUsers'
        });

        res.json({
            hasClaimed,
            balance: balance.toString(),
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching status' });
    }
};

export const claimTokens = async (req: AuthRequest, res: Response) => {
    const userAddress = req.user?.address as `0x${string}`;
    if (!userAddress) return res.status(401).json({ error: 'Unauthorized' });

    if (db.hasClaimed(userAddress)) {
        return res.status(400).json({ error: 'Address has already claimed tokens' });
    }

    try {
        // 1. Get Faucet Amount
        const amount = await client.readContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'getFaucetAmount'
        });

        // 2. Check Backend Balance
        const backendBalance = await client.readContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'balanceOf',
            args: [account.address]
        });

        // 3. If Backend Balance is low, try to claim (Self-Fund)
        if (backendBalance < amount) {
            try {
                const hash = await client.writeContract({
                    address: CONFIG.CONTRACT_ADDRESS,
                    abi: FAUCET_ABI,
                    functionName: 'claimTokens'
                });
                await client.waitForTransactionReceipt({ hash });
                console.log('Backend claimed tokens for itself:', hash);
            } catch (e) {
                console.warn('Backend failed to claim tokens (might have already claimed):', e);
            }
        }

        // 4. Transfer to User
        // Note: We use transfer because claimTokens mints to msg.sender (backend).
        const txHash = await client.writeContract({
            address: CONFIG.CONTRACT_ADDRESS,
            abi: FAUCET_ABI,
            functionName: 'transfer',
            args: [userAddress, amount]
        });

        db.addClaim(userAddress);

        res.json({ txHash, success: true });

    } catch (error: any) {
        console.error('Claim error:', error);
        res.status(500).json({ error: error.message || 'Error claiming tokens' });
    }
};
