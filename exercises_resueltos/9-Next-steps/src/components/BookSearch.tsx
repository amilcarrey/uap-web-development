import { useState } from 'react'

interface BookSearchProps {
  onSearch: (query: string, searchType: string) => void;
  loading: boolean;
}

export default function BookSearch({ onSearch, loading }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('title')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim(), searchType)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar libros
            </label>
            <input
              type="text"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === 'title' ? 'Título del libro...' :
                searchType === 'author' ? 'Nombre del autor...' :
                'ISBN...'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
              disabled={loading}
            />
          </div>
          
          <div className="w-full sm:w-40">
            <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por
            </label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
              disabled={loading}
            >
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="isbn">ISBN</option>
            </select>
          </div>
          
          <div className="self-end">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Ejemplos: 
          {searchType === 'title' && ' "Cien años de soledad"'}
          {searchType === 'author' && ' "Gabriel García Márquez"'}
          {searchType === 'isbn' && ' 9788437604947'}
        </p>
      </div>
    </div>
  )
}