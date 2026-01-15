import { useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useMutation, useQuery } from '@tanstack/react-query';
import FaucetCard from './components/FaucetCard';
import TokenInfo from './components/TokenInfo';
import UsersList from './components/UsersList';
import { SEPOLIA_CHAIN_ID, shorten } from './utils';
import { useAuth } from './contexts/AuthContext';
import { ApiError, claimFaucet, getFaucetInfo, getFaucetStatus } from './api/client';

export default function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { connect, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    token,
    address: authAddress,
    isAuthenticated,
    isSigning,
    error: authError,
    signIn,
    signOut,
    clearError
  } = useAuth();

  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID;
  const wcEnabled = !!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  const activeAddress = authAddress ?? address ?? null;

  useEffect(() => {
    if (!isAuthenticated) {
      setLastTxHash(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setClaimError(null);
  }, [activeAddress, isWrongNetwork]);

  const statusQuery = useQuery({
    queryKey: ['faucet-status', activeAddress, token],
    queryFn: () => getFaucetStatus(activeAddress!, token!),
    enabled: Boolean(isAuthenticated && token && activeAddress && !isWrongNetwork),
    retry: 1
  });

  const infoQuery = useQuery({
    queryKey: ['faucet-info', token],
    queryFn: () => getFaucetInfo(token!),
    enabled: Boolean(isAuthenticated && token && !isWrongNetwork),
    retry: 1
  });

  useEffect(() => {
    const err = statusQuery.error;
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      signOut();
    }
  }, [statusQuery.error, signOut]);

  useEffect(() => {
    const err = infoQuery.error;
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      signOut();
    }
  }, [infoQuery.error, signOut]);

  const claimMutation = useMutation({
    mutationFn: () => claimFaucet(token!),
    onMutate: () => {
      setClaimError(null);
    },
    onSuccess: (result) => {
      setLastTxHash(result.txHash ?? null);
      statusQuery.refetch();
      infoQuery.refetch();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          signOut();
          setClaimError('Sesion expirada. Vuelve a firmar.');
        } else {
          setClaimError(err.message);
        }
      } else if (err instanceof Error) {
        setClaimError(err.message);
      } else {
        setClaimError('No se pudo completar el reclamo');
      }
    }
  });

  const handleClaim = async () => {
    if (!token) return;
    await claimMutation.mutateAsync();
  };

  const canAuthenticate = useMemo(() => {
    if (!isConnected) return false;
    if (isWrongNetwork) return false;
    return !isSigning;
  }, [isConnected, isSigning, isWrongNetwork]);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif', maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Cucho Blockchaimn</h1>
          <small>Contrato: 0x3e2117c19a921507ead57494bbf29032f33c7412</small>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isConnected ? (
              <span title={address ?? undefined}>Conectado: {shorten(address)}</span>
            ) : (
              <span>Conecta tu wallet</span>
            )}
            {wcEnabled ? (
              <w3m-button />
            ) : (
              isConnected ? (
                <button onClick={() => disconnect()} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer' }}>
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => connect({ connector: injected() })}
                  disabled={connecting}
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #059669', backgroundColor: '#059669', color: 'white', cursor: connecting ? 'not-allowed' : 'pointer' }}
                >
                  {connecting ? 'Conectando...' : 'Conectar MetaMask'}
                </button>
              )
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: isAuthenticated ? '#059669' : '#b91c1c' }}>
              {isAuthenticated ? 'Autenticado via SIWE' : 'No autenticado'}
            </span>
            {isAuthenticated ? (
              <button onClick={signOut} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer' }}>
                Cerrar sesion
              </button>
            ) : (
              <button
                onClick={() => signIn().catch(() => undefined)}
                disabled={!canAuthenticate}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #2563eb', backgroundColor: '#2563eb', color: 'white', cursor: canAuthenticate ? 'pointer' : 'not-allowed' }}
              >
                {isSigning ? 'Firmando...' : 'Firmar SIWE'}
              </button>
            )}
          </div>
        </div>
      </header>

      {authError && (
        <div
          style={{
            padding: 12,
            background: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: 10,
            marginBottom: 16,
            color: '#b91c1c',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <span>{authError}</span>
          <button
            onClick={() => {
              clearError();
              setClaimError(null);
            }}
            style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer' }}
          >
            Cerrar
          </button>
        </div>
      )}

      {isWrongNetwork && (
        <div style={{
          padding: 16,
          background: '#fee2e2',
          border: '2px solid #dc2626',
          borderRadius: 12,
          marginBottom: 16,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: 8 }}>RED INCORRECTA DETECTADA</div>
          <div style={{ marginBottom: 12, color: '#dc2626', fontWeight: 'bold' }}>
            Estas conectado a chainId {chainId}. Esta aplicacion solo funciona en Sepolia testnet para evitar gastos reales.
          </div>
          <div style={{ marginBottom: 12, fontSize: '0.9rem' }}>
            ADVERTENCIA: Usar esta aplicacion en Ethereum mainnet te cobrara ETH real.
          </div>
          <button
            onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}
            disabled={switching}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#dc2626',
              color: 'white',
              cursor: switching ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {switching ? 'Cambiando a Sepolia...' : 'Cambiar a Sepolia ahora'}
          </button>
        </div>
      )}

      <main style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', marginTop: 8 }}>
        <FaucetCard
          isConnected={isConnected}
          isWrongNetwork={isWrongNetwork}
          isAuthenticated={isAuthenticated}
          statusLoading={statusQuery.isLoading || statusQuery.isFetching}
          infoLoading={infoQuery.isLoading || infoQuery.isFetching}
          hasClaimed={statusQuery.data?.hasClaimed}
          balanceWei={statusQuery.data?.balance}
          faucetAmountWei={statusQuery.data?.faucetAmount ?? infoQuery.data?.faucetAmount}
          decimals={infoQuery.data?.decimals}
          onClaim={handleClaim}
          isClaiming={claimMutation.isPending}
          lastTxHash={lastTxHash}
          claimError={claimError}
        />
        <TokenInfo
          info={infoQuery.data}
          balanceWei={statusQuery.data?.balance}
          isInfoLoading={infoQuery.isLoading || infoQuery.isFetching}
          isStatusLoading={statusQuery.isLoading || statusQuery.isFetching}
          isAuthenticated={isAuthenticated}
        />
        <UsersList
          users={statusQuery.data?.users ?? []}
          isLoading={statusQuery.isLoading}
          isRefreshing={statusQuery.isFetching}
          onRefresh={() => statusQuery.refetch()}
          isAuthenticated={isAuthenticated}
        />
      </main>

      <footer style={{ marginTop: 32, opacity: 0.8 }}>
        <small>
          Aplicacion segura: Solo funciona en Sepolia testnet.
          Los ETH de Sepolia son gratuitos y no tienen valor real.
          <br />
          Hecho con Wagmi + Viem + Web3Modal + Express backend.
        </small>
      </footer>
    </div>
  );
}
