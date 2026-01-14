'use client'
import { useAccount } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getToken } from '@/lib/auth'
import { claim, status } from '@/lib/api'
import { CONTRACT_ADDRESS } from '@/lib/contract'
import { formatUnits } from 'viem'

const short = (a?: `0x${string}`) => (a ? `${a.slice(0,6)}…${a.slice(-4)}` : '')

export default function Faucet() {
  const { address, isConnected } = useAccount()
  const [jwt, setJwt] = useState<string | null>(null)

  const [name, setName] = useState<string>('—')
  const [symbol, setSymbol] = useState<string>('—')
  const [decimals, setDecimals] = useState<number>(18)
  const [amount, setAmount] = useState<string>('0')
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [users, setUsers] = useState<string[]>([])

  const [txHash, setTxHash] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => setJwt(getToken()), [])

  async function load() {
    if (!jwt || !address) return
    const s = await status(jwt, address)
    setHasClaimed(s.hasClaimed)
    setBalance(s.balance)
    setUsers(s.users)
    setAmount(s.amount)
    setName(s.token.name)
    setSymbol(s.token.symbol)
    setDecimals(Number(s.token.decimals))
  }

  useEffect(() => { load().catch(console.error) }, [jwt, address])

  const prettyAmount = useMemo(() => formatUnits(BigInt(amount || '0'), decimals), [amount, decimals])
  const prettyBalance = useMemo(() => formatUnits(BigInt(balance || '0'), decimals), [balance, decimals])
  const canClaim = isConnected && !!jwt && hasClaimed === false && !sending

  async function handleClaim() {
    if (!jwt) return alert('Primero iniciá sesión (SIWE)')
    setSending(true); setErr(null); setTxHash(null)
    try {
      const { txHash } = await claim(jwt)
      setTxHash(txHash)
      // pequeña espera y refrescamos estado
      setTimeout(load, 5000)
    } catch (e: any) {
      setErr(e?.message || 'Error en reclamo')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Title bar */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">
          Faucet <span className="text-white/50">/</span> Panel
        </h1>
        <div className="text-xs px-2 py-1 rounded-md border border-white/10 bg-white/5">
          {isConnected ? (jwt ? 'Autenticado' : 'Conectado sin sesión') : 'Desconectado'}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        {/* Token Info */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 p-4 md:p-5 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Información del Token</h2>
            <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Faucet activo
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
            <dt className="opacity-60">Nombre</dt>
            <dd className="truncate">{name}</dd>

            <dt className="opacity-60">Símbolo</dt>
            <dd className="truncate">{symbol}</dd>

            <dt className="opacity-60">Decimales</dt>
            <dd className="truncate">{decimals}</dd>

            <dt className="opacity-60">Faucet amount</dt>
            <dd className="truncate">{prettyAmount} {symbol}</dd>

            <dt className="opacity-60">Contrato</dt>
            <dd className="truncate">
              <Link
                className="underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
              >
                {short(CONTRACT_ADDRESS)}
              </Link>
            </dd>
          </dl>
        </div>

        {/* User State */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 p-4 md:p-5">
          <h2 className="font-semibold mb-3">Tu Estado</h2>
          {!isConnected ? (
            <div className="text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Conectá tu wallet.
            </div>
          ) : !jwt ? (
            <div className="text-sm flex items-center gap-2 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Iniciá sesión (SIWE) desde el header para ver y reclamar.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
              <div className="opacity-60">Dirección</div>
              <div className="truncate">{short(address)}</div>

              <div className="opacity-60">Balance</div>
              <div className="truncate">{prettyBalance} {symbol}</div>

              <div className="opacity-60">¿Ya reclamaste?</div>
              <div className="truncate">
                {hasClaimed === null ? '—' : hasClaimed ? 'Sí' : 'No'}
              </div>
            </div>
          )}
        </div>

        {/* Claim */}
        <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Reclamar Tokens</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border
              ${hasClaimed ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-white/70'}`}>
              {hasClaimed ? 'Reclamado' : 'Disponible'}
            </span>
          </div>

          <button
            disabled={!canClaim}
            onClick={handleClaim}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition
              ${canClaim
                ? 'border-emerald-500/30 bg-emerald-600/80 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                : 'opacity-50 cursor-not-allowed border-white/10 bg-white/5'
              }`}
          >
            {sending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                Enviando…
              </>
            ) : (
              'Reclamar'
            )}
          </button>

          <div className="mt-4 text-sm space-y-2">
            {err && <div className="text-red-400">Error: {err}</div>}
            {txHash && (
              <div className="break-all">
                TX:{' '}
                <Link
                  className="underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
                  target="_blank"
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                >
                  {short(txHash as `0x${string}`)}
                </Link>
              </div>
            )}
            {hasClaimed && <div className="text-emerald-300/90">Ya reclamaste; el botón se desactiva.</div>}
          </div>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Usuarios del Faucet</h2>
            <span className="text-xs text-white/60">{users?.length || 0}</span>
          </div>

          {!users?.length ? (
            <p className="text-sm opacity-70">Sin usuarios todavía.</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-56 overflow-auto rounded-md border border-white/10 bg-white/5 p-2">
              {users.map((u) => (
                <li key={u} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span className="truncate">{u}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
