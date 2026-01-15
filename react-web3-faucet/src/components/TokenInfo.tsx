import { useMemo } from 'react';
import { formatUnits } from '../utils';

type TokenInfoData = {
  name: string;
  symbol: string;
  decimals: number;
  faucetAmount: string;
};

type Props = {
  info?: TokenInfoData;
  balanceWei?: string;
  isInfoLoading: boolean;
  isStatusLoading: boolean;
  isAuthenticated: boolean;
};

export default function TokenInfo({ info, balanceWei, isInfoLoading, isStatusLoading, isAuthenticated }: Props) {
  const loading = isInfoLoading || isStatusLoading;
  const decimals = info?.decimals ?? 18;

  const faucetAmount = useMemo(() => {
    if (!info) return '...';
    try {
      return formatUnits(BigInt(info.faucetAmount), info.decimals);
    } catch {
      return '...';
    }
  }, [info]);

  const balance = useMemo(() => {
    if (!info || !balanceWei) return '0';
    try {
      return formatUnits(BigInt(balanceWei), info.decimals);
    } catch {
      return '0';
    }
  }, [info, balanceWei]);

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Informacion del token</h2>
      {!isAuthenticated ? (
        <p style={{ margin: 0 }}>Autenticate para ver la informacion del token.</p>
      ) : loading ? (
        <p style={{ margin: 0 }}>Cargando informacion...</p>
      ) : !info ? (
        <p style={{ margin: 0 }}>No se pudo obtener la informacion del token.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 520 }}>
          <div>
            <b>Nombre</b>
            <div>{info.name}</div>
          </div>
          <div>
            <b>Simbolo</b>
            <div>{info.symbol}</div>
          </div>
          <div>
            <b>Decimales</b>
            <div>{decimals}</div>
          </div>
          <div>
            <b>Monto por reclamo</b>
            <div>{faucetAmount}</div>
          </div>
          <div>
            <b>Tu balance</b>
            <div>{balance}</div>
          </div>
        </div>
      )}
    </section>
  );
}
