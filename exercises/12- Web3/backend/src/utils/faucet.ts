import { ethers } from 'ethers'
import FaucetABI from '../contracts/FaucetTokenABI.json'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

// Validate PRIVATE_KEY format: must be 0x + 64 hex chars
const rawKey = process.env.PRIVATE_KEY ?? ''
const isValidKey = /^0x[0-9a-fA-F]{64}$/.test(rawKey)

let faucetContract: ethers.Contract
let isWritable = false

if (isValidKey) {
	const wallet = new ethers.Wallet(rawKey, provider)
	faucetContract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, FaucetABI, wallet)
	isWritable = true
} else {
	// Fallback to read-only contract (provider). Avoid throwing so server can start.
	console.warn('PRIVATE_KEY is missing or invalid. Faucet contract initialized in read-only mode. Write operations will fail until a valid private key is provided (format: 0x...).')
	faucetContract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, FaucetABI, provider)
	isWritable = false
}

export { faucetContract, isWritable }
