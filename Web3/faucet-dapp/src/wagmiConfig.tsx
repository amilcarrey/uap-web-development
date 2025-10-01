import { createConfig, http, WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
console.log('PID', import.meta.env.VITE_WALLETCONNECT_PROJECT_ID)

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com'),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,            // muestra QR para wallets móviles
      metadata: {
        name: 'FaucetToken dApp',
        description: 'React + Wagmi + Viem faucet',
        url: 'http://localhost:5173',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      }
    }),
  ],
})

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
