'use client'
import { useEffect, useRef, useState } from 'react'
import { useAccount, useChainId, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { getSiweMessage, signin } from '@/lib/api'
import { getToken, setToken, clearToken } from '@/lib/auth'

const short = (a?: `0x${string}`) => (a ? `${a.slice(0,6)}…${a.slice(-4)}` : '')

export default function Header() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { connectors, connectAsync, isPending } = useConnect()
  const { signMessageAsync } = useSignMessage()

  // MetaMask (injected) – sin Web3Modal
  const injected = connectors.find(c => c.id === 'injected')

  const [jwt, setJwt] = useState<string | null>(null)
  useEffect(() => setJwt(getToken()), [])

  // Evitar doble solicitud a MetaMask
  const connectingRef = useRef(false)
  async function handleConnect() {
    if (!injected || isPending || connectingRef.current) return
    connectingRef.current = true
    try {
      await connectAsync({ connector: injected })
    } catch (err: any) {
      const code = err?.code ?? err?.cause?.code
      if (code === -32002) {
        alert('MetaMask ya tiene una solicitud abierta. Abrí el icono y aceptá/cancelá esa notificación.')
      } else {
        alert(err?.shortMessage || err?.message || 'No se pudo conectar')
      }
    } finally {
      connectingRef.current = false
    }
  }

  async function handleSiwe() {
    if (!address) return
    const { message } = await getSiweMessage(address)
    const signature = await signMessageAsync({ message })
    const { token } = await signin(address, message, signature)
    setToken(token)
    setJwt(token)
  }

  const onSepolia = chainId === Number(process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID ?? 11155111)

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-emerald-500/40 via-emerald-400/60 to-emerald-500/40" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Brand + Network */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 blur-xl rounded-full bg-emerald-500/10 pointer-events-none" />
              <div className="relative inline-flex items-center gap-2">
                {/* Minimal inline logo (no imports) */}
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-900/30">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/90" aria-hidden="true">
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.3L6 8v8l6 3.3 6-3.3V8l-6-2.7z" fill="currentColor"/>
                  </svg>
                </span>
                <span className="text-base sm:text-lg font-semibold tracking-tight">
                  Token App
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border transition
              ${onSepolia
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'
                : 'bg-amber-500/10 text-amber-200 border-amber-400/20'
              }`}
              title={onSepolia ? 'Conectado a Sepolia' : 'Cambiá la red a Sepolia'}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current/80" />
              {onSepolia ? 'Sepolia' : 'Switch a Sepolia'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                {jwt ? (
                  <button
                    className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:bg-white/15 text-sm transition"
                    onClick={() => { clearToken(); setJwt(null) }}
                    title="Cerrar sesión de la dApp (no desconecta la wallet)"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center rounded-lg border border-emerald-600/30 px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm shadow-sm shadow-emerald-900/30 transition"
                    onClick={handleSiwe}
                    title="Firmar mensaje para iniciar sesión (SIWE)"
                  >
                    Iniciar sesión
                  </button>
                )}

                <span
                  className="hidden sm:inline text-sm text-zinc-300/90 rounded-md px-2 py-1 bg-white/5 border border-white/10"
                  title={address}
                >
                  {short(address)}
                </span>

                <button
                  className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:bg-white/15 text-sm transition"
                  onClick={() => disconnect()}
                  title="Desconectar wallet"
                >
                  Desconectar
                </button>
              </>
            ) : (
              <button
                className="inline-flex items-center rounded-lg border border-emerald-600/25 px-3 py-1.5 bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-600/90 hover:to-emerald-500/90 active:from-emerald-700 active:to-emerald-600 text-white text-sm shadow-sm shadow-emerald-900/30 transition"
                onClick={handleConnect}
                disabled={!injected || isPending || connectingRef.current}
                title="Conectar con MetaMask"
              >
                {isPending || connectingRef.current ? 'Conectando…' : 'Conectar MetaMask'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="h-px w-full bg-white/5" />
    </header>
  )
}
