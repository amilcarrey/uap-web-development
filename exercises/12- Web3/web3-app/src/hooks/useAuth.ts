import { useAccount, useSignMessage } from 'wagmi'
import { useState } from 'react'
import { getSiweMessage, signinSiwe } from '../services/api'

export function useAuth() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [jwt, setJwt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!address) return
    setLoading(true)
    try {
      const { message } = await getSiweMessage(address)
      const signature = await signMessageAsync({ message })
      const { token } = await signinSiwe(message, signature)
      setJwt(token)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { jwt, login, loading, address }
}
