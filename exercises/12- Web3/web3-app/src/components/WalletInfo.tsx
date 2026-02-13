import { useAccount } from 'wagmi'

export const WalletInfo = () => {
  const { address, isConnected } = useAccount()
  return (
    <div className="card info-card">
      <h4>Wallet</h4>
      <p className="small">{isConnected ? `Conectado: ${address}` : 'No conectado'}</p>
    </div>
  )
}
