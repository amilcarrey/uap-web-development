export const SEPOLIA_CHAIN_ID = 11155111 as const

export function shorten(addr?: string, size = 4) {
  if (!addr) return ''
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`
}

export function formatUnits(value: bigint | undefined, decimals = 18) {
  if (value === undefined) return '—'
  const negative = value < 0n
  let str = (negative ? -value : value).toString().padStart(decimals + 1, '0')
  const int = str.slice(0, -decimals) || '0'
  const frac = str.slice(-decimals).replace(/0+$/, '')
  return `${negative ? '-' : ''}${int}${frac ? '.' + frac : ''}`
}
