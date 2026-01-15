export const faucetTokenAbi = [
  { "type": "function", "name": "claimTokens", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "hasAddressClaimed", "stateMutability": "view", "inputs": [{ "name": "account", "type": "address" }], "outputs": [{ "type": "bool" }] },
  { "type": "function", "name": "getFaucetUsers", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "address[]"}] },
  { "type": "function", "name": "getFaucetAmount", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "uint256"}] },
  { "type": "function", "name": "balanceOf", "stateMutability": "view", "inputs": [{ "name": "account", "type": "address" }], "outputs": [{ "type": "uint256"}] },
  { "type": "function", "name": "name", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "string" }] },
  { "type": "function", "name": "symbol", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "string" }] },
  { "type": "function", "name": "decimals", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "uint8" }] }
];
