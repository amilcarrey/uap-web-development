import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    RPC_URL: process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
    PRIVATE_KEY: process.env.PRIVATE_KEY as `0x${string}`,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS as `0x${string}`,
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
};

if (!CONFIG.PRIVATE_KEY || !CONFIG.CONTRACT_ADDRESS) {
    console.warn('Missing PRIVATE_KEY or CONTRACT_ADDRESS in .env');
}
