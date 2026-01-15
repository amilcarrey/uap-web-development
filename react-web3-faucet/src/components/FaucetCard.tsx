import { useMemo } from 'react';
import { formatUnits } from '../utils';

type Props = {
  isConnected: boolean;
  isWrongNetwork: boolean;
  isAuthenticated: boolean;
  statusLoading: boolean;
  infoLoading: boolean;
  hasClaimed?: boolean;
  balanceWei?: string;
  faucetAmountWei?: string;
  decimals?: number;
  onClaim: () => void;
  isClaiming: boolean;
  lastTxHash: string | null;
  claimError: string | null;
};

export default function FaucetCard(props: Props) {
  const {
    isConnected,
    isWrongNetwork,
    isAuthenticated,
    statusLoading,
    infoLoading,
    hasClaimed,
    balanceWei,
    faucetAmountWei,
    decimals,
    onClaim,
    isClaiming,
    lastTxHash,
    claimError
  } = props;

  const loading = statusLoading || infoLoading;

  const faucetAmount = useMemo(() => {
    if (!faucetAmountWei || decimals === undefined) return '...';
    try {
      return formatUnits(BigInt(faucetAmountWei), decimals);
    } catch {
      return '...';
    }
  }, [faucetAmountWei, decimals]);

  const balance = useMemo(() => {
    if (!balanceWei || decimals === undefined) return '0';
    try {
      return formatUnits(BigInt(balanceWei), decimals);
    } catch {
      return '0';
    }
  }, [balanceWei, decimals]);

  const claimButtonDisabled =
    !isAuthenticated ||
    !isConnected ||
    isWrongNetwork ||
    loading ||
    hasClaimed ||
    isClaiming;

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Faucet</h2>
      <p style={{ marginTop: 0 }}>
        Reclama <b>{faucetAmount}</b> tokens del FaucetToken (una vez por direccion).
      </p>

      <ul style={{ lineHeight: 1.8, marginTop: 8 }}>
        <li>Conexion wallet: {isConnected ? 'Activa' : 'Desconectada'}</li>
        <li>Sesion SIWE: {isAuthenticated ? 'Activa' : 'Requerida'}</li>
        <li>Estado reclamo: {loading ? 'Verificando...' : hasClaimed ? 'Ya reclamaste' : 'Disponible'}</li>
        <li>Balance actual: {decimals === undefined ? '...' : balance}</li>
      </ul>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          disabled={claimButtonDisabled}
          onClick={onClaim}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid #059669',
            backgroundColor: claimButtonDisabled ? '#d1d5db' : '#059669',
            color: claimButtonDisabled ? '#374151' : 'white',
            fontWeight: 'bold',
            cursor: claimButtonDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {isClaiming ? 'Firmando transaccion...' : 'Reclamar tokens'}
        </button>
        {lastTxHash && (
          <span>
            Ultima transaccion: <a href={`https://sepolia.etherscan.io/tx/${lastTxHash}`} target="_blank" rel="noreferrer">{lastTxHash.slice(0, 10)}...</a>
          </span>
        )}
      </div>

      {!isConnected && (
        <div style={{ marginTop: 12, color: '#b91c1c' }}>
          Conecta tu wallet para continuar.
        </div>
      )}
      {isConnected && !isAuthenticated && (
        <div style={{ marginTop: 12, color: '#b91c1c' }}>
          Firma con SIWE antes de reclamar.
        </div>
      )}
      {claimError && (
        <div style={{ marginTop: 12, color: '#b91c1c' }}>
          {claimError}
        </div>
      )}
    </section>
  );
}
