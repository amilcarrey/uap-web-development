import React, { useState } from 'react'
import { searchBooks } from '../api/googleBooks'
import type { Book } from '../types/book'
import { BookCard } from '../components/BookCard'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const items = await searchBooks(query)
      setBooks(items ?? [])
    } catch (err) {
      console.error(err)
      setError('Error al buscar libros. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por título, autor o ISBN"
          className="flex-grow border rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading && <p className="text-center">Cargando resultados…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">Sin resultados</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}