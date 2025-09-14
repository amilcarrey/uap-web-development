'use client'
import { useState } from 'react'
import Link from 'next/link'

type Item = {
  id: string
  title: string
  authors: string[]
  thumbnail?: string
}

export default function Home() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  async function search(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">📚 Descubrí libros</h1>
      <form onSubmit={search} className="flex gap-2">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Título, autor o ISBN (p.ej. inauthor:rowling)"
          className="flex-1 border border-gray-700 bg-gray-800 rounded px-3 py-2 text-gray-100"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!q}>Buscar</button>
      </form>

      {loading && <div>Buscando…</div>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(b => (
          <li key={b.id} className="border border-gray-700 rounded-xl p-3 flex gap-3 bg-gray-800">
            {b.thumbnail && <img src={b.thumbnail} alt="cover" className="w-16 h-24 object-cover rounded" />}
            <div>
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-400">{b.authors?.join(', ')}</div>
              <Link href={`/book/${b.id}`} className="text-blue-400 text-sm">Ver detalles →</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}