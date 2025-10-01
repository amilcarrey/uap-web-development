import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain,
         useWriteContract, useWaitForTransactionReceipt, useSignMessage } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useMemo, useState } from 'react'
import { postJSON, getJSON, setToken, getToken } from './api'
import { faucetAbi } from './abi'

const CONTRACT = '0x3E2117C19A921507EaD57494BbF29032F33C7412' as const

export default function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
const { connect, connectors, status: connectStatus } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { signMessageAsync } = useSignMessage()

  const [authAddr, setAuthAddr] = useState<string | null>(null)
  const [status, setStatus] = useState<any>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const wrongNetwork = isConnected && chainId !== sepolia.id

  // claim TX (Modo A: el front envía la tx que el backend preparó)
  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { data: receipt, isLoading: waitingReceipt } = useWaitForTransactionReceipt({ hash: txHash })

  const isAuthed = useMemo(() => Boolean(getToken() && authAddr && isConnected && address?.toLowerCase() === authAddr?.toLowerCase()), [authAddr, isConnected, address])

  async function siweLogin() {
    if (!isConnected || !address) return
    if (wrongNetwork) await switchChain({ chainId: sepolia.id })

    // 1) pedir mensaje SIWE al backend
    const { token: nonce, message } = await postJSON('/auth/message', { address, chainId: sepolia.id })
    // 2) firmar el mensaje con la wallet
    const signature = await signMessageAsync({ message })
    // 3) validar en backend y obtener JWT
    const { token, address: who } = await postJSON('/auth/signin', { message, signature })
    setToken(token)
    setAuthAddr(who)
    await refreshStatus()
  }

  async function refreshStatus() {
    if (!isConnected || !address || !getToken()) return
    try {
      setLoadingStatus(true)
      const data = await getJSON(`/faucet/status/${address}`, true)
      setStatus(data)
    } finally {
      setLoadingStatus(false)
    }
  }

  async function onClaim() {
    if (!isAuthed) return
    const resp = await postJSON('/faucet/claim', {}, true)

    if (resp.mode === 'client_sends_tx' && resp.txRequest) {
      // MODO A: el back nos dio la calldata y el contrato -> enviamos la TX desde la wallet del usuario
      writeContract({
        address: CONTRACT,
        abi: faucetAbi,
        functionName: 'claimTokens'
      })
    } else if (resp.mode === 'server_mints') {
      // MODO B: el server minteó y nos devolvió el hash
      // opcional: podés mostrar resp.txHash y refrescar
    }
  }

  useEffect(() => { refreshStatus() }, [isAuthed])

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', fontFamily: 'ui-sans-serif, system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>Faucet <small style={{ opacity: .7 }}>(Auth + Backend)</small></h1>
        <div>
          {isConnected ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 14, opacity: .8 }}> {address?.slice(0, 6)}…{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} aria-label="Desconectar">Desconectar</button>
            </div>
          ) : (
            <>
              {connectors.map((c) => (
                 <button
                  key={c.uid}
                  onClick={() => connect({ connector: c })}
                   disabled={connectStatus === 'pending'}
                 >
                  {c.name.includes('WalletConnect') ? 'Conectar WalletConnect' : `Conectar ${c.name}`}
                 </button>
              ))}
            </>
          )}
        </div>
      </header>

      {isConnected && !isAuthed && (
        <div style={{ background: '#eef', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <p style={{ marginBottom: 8 }}>Autentícate con <strong>Sign-In with Ethereum</strong> para usar el faucet.</p>
          <button onClick={siweLogin}>Iniciar sesión (SIWE)</button>
        </div>
      )}

      {isConnected && wrongNetwork && (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          Estás en la red equivocada. Seleccioná Sepolia (ID {sepolia.id}).
          <button style={{ marginLeft: 8 }} onClick={() => switchChain({ chainId: sepolia.id })}>Cambiar a Sepolia</button>
        </div>
      )}

      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <article style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
          <h3>Información del token</h3>
          {!status || loadingStatus ? <p>Cargando…</p> : (
            <>
              <p><strong>Nombre:</strong> {status.token?.name}</p>
              <p><strong>Símbolo:</strong> {status.token?.symbol}</p>
              <p><strong>Decimales:</strong> {status.token?.decimals}</p>
              <p><strong>Monto por reclamo:</strong> {status.token?.faucetAmount}</p>
              <p><strong>Tu balance:</strong> {status?.balance}</p>
            </>
          )}
        </article>

        <article style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
          <h3>Estado de reclamo</h3>
          {!isAuthed && <p>Iniciá sesión con SIWE para continuar.</p>}
          {isAuthed && (
            <>
              <p>{status?.hasClaimed ? 'Ya reclamaste ❌' : 'No reclamaste todavía ✅'}</p>
              <button onClick={onClaim} disabled={!isAuthed || status?.hasClaimed || isPending || waitingReceipt}>
                {isPending || waitingReceipt ? 'Procesando…' : 'Reclamar'}
              </button>
              {txHash && <p style={{ fontSize: 12, opacity: .8, marginTop: 8 }}>TX: {txHash.slice(0, 10)}…</p>}
              {receipt && <p style={{ color: 'green' }}>¡Listo! Bloque {receipt.blockNumber?.toString()}</p>}
            </>
          )}
        </article>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
        <h3>Usuarios que interactuaron</h3>
        {!status?.users ? <p>Cargando…</p> : (
          <ul>
            {status.users.slice().reverse().slice(0, 50).map((u: string, i: number) => (
              <li key={u + i} style={{ fontFamily: 'ui-monospace, SFMono-Regular' }}>{u}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
