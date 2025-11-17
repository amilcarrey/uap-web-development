import { ethers, BaseContract } from 'ethers';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not set in environment variables');
}

if (!CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS is not set in environment variables');
}

export const FAUCET_TOKEN_ABI = [
    {
        inputs: [],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "hasAddressClaimed",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getFaucetUsers",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getFaucetAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
    },
] as const;

// Provider para lectura
export const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
)

// Wallet para transacciones
export const wallet = new ethers.Wallet(
    PRIVATE_KEY,
    provider
)

export interface FaucetTokenContract extends BaseContract {
    claimTokens(): Promise<ethers.ContractTransactionResponse>;
    hasAddressClaimed(account: string): Promise<boolean>;
    balanceOf(account: string): Promise<bigint>;
    getFaucetUsers(): Promise<string[]>;
    getFaucetAmount(): Promise<bigint>;
}

// Instancia del contrato
export const faucetContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    FAUCET_TOKEN_ABI,
    wallet
) as unknown as FaucetTokenContract;

