import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// CONFIGURACIÓN DE SEGURIDAD: Solo Sepolia testnet
// Esto previene cualquier transacción en mainnet que cobraría ETH real
const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

// Verificación adicional: Asegurar que solo usamos Sepolia
const ALLOWED_CHAIN_ID = 11155111 // Sepolia testnet
if (sepolia.id !== ALLOWED_CHAIN_ID) {
  throw new Error('🚫 CONFIGURACIÓN INCORRECTA: Solo se permite Sepolia testnet')
}

export const config = createConfig({
  chains: [sepolia], // Solo Sepolia - no mainnet, no otras redes
  transports: {
    [sepolia.id]: http(RPC_URL) // Solo RPC de Sepolia
  },
  connectors: [
    injected({ 
      shimDisconnect: true,
      // Configurar para que prefiera Sepolia
    }),
    ...(WC_PROJECT_ID ? [walletConnect({ 
      projectId: WC_PROJECT_ID
    })] : [])
  ]
})
