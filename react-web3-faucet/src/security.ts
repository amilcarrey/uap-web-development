// Configuración de seguridad global para prevenir uso de mainnet
export const SECURITY_CONFIG = {
  // Solo Sepolia testnet permitido
  ALLOWED_CHAIN_ID: 11155111,
  CHAIN_NAME: 'Sepolia',
  
  // Verificar que estamos en la red correcta antes de cualquier transacción
  validateChainId: (currentChainId: number) => {
    if (currentChainId !== SECURITY_CONFIG.ALLOWED_CHAIN_ID) {
      throw new Error(`🚫 Red bloqueada: ${currentChainId}. Solo se permite Sepolia (${SECURITY_CONFIG.ALLOWED_CHAIN_ID})`)
    }
    return true
  },
  
  // Mensaje de advertencia para usuarios
  getNetworkWarning: (currentChainId: number) => {
    if (currentChainId === 1) {
      return '⚠️ PELIGRO: Estás en Ethereum mainnet. Las transacciones costarán ETH real.'
    }
    if (currentChainId !== SECURITY_CONFIG.ALLOWED_CHAIN_ID) {
      return `⚠️ Red incorrecta: ${currentChainId}. Cambia a Sepolia (${SECURITY_CONFIG.ALLOWED_CHAIN_ID})`
    }
    return null
  }
}

// Hook personalizado para validar la red antes de transacciones
export function useChainSecurity() {
  return {
    validateBeforeTransaction: (chainId: number) => {
      return SECURITY_CONFIG.validateChainId(chainId)
    },
    isSecureChain: (chainId: number) => {
      return chainId === SECURITY_CONFIG.ALLOWED_CHAIN_ID
    },
    getWarning: (chainId: number) => {
      return SECURITY_CONFIG.getNetworkWarning(chainId)
    }
  }
}