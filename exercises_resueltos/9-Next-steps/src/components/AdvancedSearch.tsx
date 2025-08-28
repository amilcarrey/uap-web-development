'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdvancedSearch() {
  const [searchType, setSearchType] = useState<'general' | 'title' | 'author' | 'isbn'>('general');
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      let searchParam = query;
      if (searchType !== 'general') {
        searchParam = `${searchType}:${query}`;
      }
      router.push(`/search?q=${encodeURIComponent(searchParam)}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Búsqueda Avanzada</h3>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Búsqueda
          </label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">Búsqueda General</option>
            <option value="title">Título</option>
            <option value="author">Autor</option>
            <option value="isbn">ISBN</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Término de Búsqueda
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'isbn' ? 'Ingresa el ISBN' :
              searchType === 'author' ? 'Ingresa el nombre del autor' :
              searchType === 'title' ? 'Ingresa el título del libro' :
              'Buscar libros...'
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}