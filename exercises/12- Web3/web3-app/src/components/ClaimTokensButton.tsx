import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useHasClaimed, useFaucetAmount, useFaucetUsers, useTokenBalance, useClaimTokens } from '../lib/faucet'

export default function ClaimButton() {
  const { address } = useAccount()
  const [status, setStatus] = useState<'idle'|'pending'|'success'|'error'>('idle')

  const hasClaimed = useHasClaimed(address)
  const faucetAmount = useFaucetAmount()
  const faucetUsers = useFaucetUsers()
  const balance = useTokenBalance(address)

  const { claim, isPending, isSuccess, error } = useClaimTokens()

  const handleClaim = async () => {
    if (!address || hasClaimed?.data) return
    setStatus('pending')
    try {
      claim()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const label = !address ? 'Conectar Wallet' : status === 'pending' || isPending ? 'Confirmando...' : hasClaimed?.data ? 'Ya reclamaste' : 'Reclamar tokens'

  return (
    <div className="card faucet-card" role="region" aria-label="Faucet">
      <div className="faucet-header">
        <h2>Faucet</h2>
        <div className={`status-badge ${hasClaimed?.data ? 'done' : 'neutral'}`}>{hasClaimed?.data ? 'Reclamado' : 'Disponible'}</div>
      </div>

      <p className="muted small">{faucetAmount?.data ? `Cada usuario recibe ${faucetAmount.data.toString()} tokens` : 'Cargando cantidad...'}</p>

      <div className="faucet-actions">
        <button className="primary" onClick={handleClaim} disabled={!address || Boolean(isPending) || status === 'pending' || Boolean(hasClaimed?.data)}>{label}</button>
        <div className="helper">{error && <span className="error">Error al reclamar</span>}{isSuccess && <span className="success">Reclamo enviado</span>}</div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h4>Tu balance</h4>
          <p className="small">{address ? (balance?.data ? `${balance.data.toString()} tokens` : 'Cargando...') : 'Conecta tu wallet'}</p>
        </div>

        <div className="info-card">
          <h4>Usuarios</h4>
          {Array.isArray(faucetUsers?.data) ? (
            <ul className="tiny-list">{faucetUsers.data.map((u: string) => <li key={u}>{u}</li>)}</ul>
          ) : (
            <p className="small">Cargando usuarios...</p>
          )}
        </div>
      </div>
    </div>
  )
}
