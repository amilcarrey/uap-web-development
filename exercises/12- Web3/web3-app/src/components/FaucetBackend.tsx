import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { claimFaucet, getFaucetStatus } from '../services/api'

export default function FaucetBackend() {
  const { jwt, login, address, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [faucetData, setFaucetData] = useState<{ balance: string; hasClaimed: boolean; users: string[] } | null>(null)

  const fetchStatus = async () => {
    if (!jwt || !address) return
    const data = await getFaucetStatus(jwt, address)
    setFaucetData(data)
  }

  useEffect(() => {
    fetchStatus()
  }, [jwt, address])

  const handleClaim = async () => {
    if (!jwt) return
    setStatus('pending')
    try {
      await claimFaucet(jwt)
      setStatus('success')
      fetchStatus()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (!address) {
    return <button onClick={login}>Conectar Wallet y Login</button>
  }

  return (
    <div className="p-4 border rounded">
      <h2>Faucet Backend</h2>

      <p>Balance: {faucetData ? faucetData.balance : 'Cargando...'}</p>
      <p>Has reclamado: {faucetData?.hasClaimed ? 'Sí' : 'No'}</p>

      <button
        onClick={handleClaim}
        disabled={status === 'pending' || faucetData?.hasClaimed || !jwt}
      >
        {faucetData?.hasClaimed ? 'Ya reclamaste' : status === 'pending' ? 'Reclamando...' : 'Reclamar tokens'}
      </button>

      <h3>Usuarios que reclamaron:</h3>
      <ul>
        {faucetData?.users?.map(u => <li key={u}>{u}</li>)}
      </ul>

      {status === 'error' && <p className="text-red-500">❌ Error al reclamar</p>}
      {status === 'success' && <p className="text-green-500">🎉 Reclamo exitoso</p>}
      {authLoading && <p>Cargando autenticación...</p>}
    </div>
  )
}
