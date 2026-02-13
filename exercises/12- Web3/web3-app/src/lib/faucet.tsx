// src/hooks/faucet.tsx
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import FaucetABI from '../contracts/FaucetTokenABI.json'
import ERC20ABI from '../contracts/ERC20ABI.json'


export const FAUCET_ADDRESS = '0x3e2117c19a921507ead57494bbf29032f33c7412'
export const TOKEN_ADDRESS = '0x3De13f7DDA8331CfD8E9b63191342B83478F9725'


// === Hooks de lectura ===
export function useHasClaimed(address?: string) {
  return useReadContract({
    address: FAUCET_ADDRESS,
    abi: FaucetABI,
    functionName: 'hasAddressClaimed',
    args: address ? [address] : undefined,
  })
}

export function useFaucetUsers() {
  return useReadContract({
    address: FAUCET_ADDRESS,
    abi: FaucetABI,
    functionName: 'getFaucetUsers',
  })
}

export function useFaucetAmount() {
  return useReadContract({
    address: FAUCET_ADDRESS,
    abi: FaucetABI,
    functionName: 'getFaucetAmount',
  })
}

// Balance del token ERC20 de un usuario
export function useTokenBalance(address?: string) {
  return useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })
}



// === hook para reclamar tokens (write) ===
export function useClaimTokens() {
  const { writeContract, data, error, isPending } = useWriteContract()

  console.log("writeContract data:", data) // 👀 para debug

  // En wagmi v1 data = hash, en otras versiones puede ser un objeto con { hash }
  const hash = typeof data === "string" ? data : (data as any)?.hash

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claim = () => {
    writeContract({
      address: FAUCET_ADDRESS,
      abi: FaucetABI,
      functionName: 'claimTokens',
    })
  }

  return {
    claim,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}
