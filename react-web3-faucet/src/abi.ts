// Minimal ABI for FaucetToken + ERC20 reads we need.
// If the on-chain contract exposes more, it's fine — we only call these.
export const faucetTokenAbi = [
  // Faucet
  { "type": "function", "name": "claimTokens", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "hasAddressClaimed", "stateMutability": "view", "inputs": [{ "name": "account", "type": "address" }], "outputs": [{ "type": "bool" }] },
  { "type": "function", "name": "getFaucetUsers", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "address[]"}] },
  { "type": "function", "name": "getFaucetAmount", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "uint256"}] },

  // ERC20
  { "type": "function", "name": "balanceOf", "stateMutability": "view", "inputs": [{ "name": "account", "type": "address" }], "outputs": [{ "type": "uint256"}] },
  { "type": "function", "name": "transfer", "stateMutability": "nonpayable", "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "type": "bool"}] },
  { "type": "function", "name": "approve", "stateMutability": "nonpayable", "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "type": "bool"}] },
  { "type": "function", "name": "allowance", "stateMutability": "view", "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "outputs": [{ "type": "uint256"}] },
  { "type": "function", "name": "name", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "string" }] },
  { "type": "function", "name": "symbol", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "string" }] },
  { "type": "function", "name": "decimals", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "uint8" }] },
] as const
