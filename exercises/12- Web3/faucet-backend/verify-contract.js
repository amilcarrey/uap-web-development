// verify-contract.js
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

const ABI = [
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
];

async function verifyContract() {
    try {
        console.log('🔍 Verifying contract...\n');
        console.log('Contract Address:', CONTRACT_ADDRESS);
        console.log('RPC URL:', RPC_URL);
        console.log('');

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // Verificar que la dirección tiene código (es un contrato)
        const code = await provider.getCode(CONTRACT_ADDRESS);
        console.log('📝 Contract code length:', code.length);
        
        if (code === '0x') {
            console.log('❌ ERROR: No contract found at this address!');
            console.log('   The address might be wrong or the contract is not deployed.');
            console.log('   Please verify the contract address in Sepolia Etherscan:');
            console.log(`   https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`);
            return;
        }
        
        console.log('✅ Contract exists at this address\n');

        // Intentar llamar a las funciones
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
        console.log('🔄 Testing getFaucetAmount()...');
        try {
            const amount = await contract.getFaucetAmount();
            console.log('✅ getFaucetAmount():', ethers.formatUnits(amount, 18), 'tokens');
        } catch (err) {
            console.log('❌ getFaucetAmount() failed:', err.message);
        }
        
        console.log('\n🔄 Testing getFaucetUsers()...');
        try {
            const users = await contract.getFaucetUsers();
            console.log('✅ getFaucetUsers():', users.length, 'users');
            users.forEach((user, i) => {
                console.log(`   ${i + 1}. ${user}`);
            });
        } catch (err) {
            console.log('❌ getFaucetUsers() failed:', err.message);
        }

        console.log('\n✅ Contract verification complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyContract();