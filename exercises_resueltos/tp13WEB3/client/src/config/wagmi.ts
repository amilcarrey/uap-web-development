import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { sepolia } from 'wagmi/chains'

export const projectId = 'a895e851213961c0c201676136110158'

const metadata = {
    name: 'Web3 Faucet',
    description: 'Web3 Faucet App',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia] as const
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})
