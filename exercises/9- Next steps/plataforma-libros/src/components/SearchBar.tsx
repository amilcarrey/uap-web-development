'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SearchBar({ onSearch }: { onSearch: (books: any[]) => void }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setError(null);

    const isISBN = /^[0-9]{10}$|^[0-9]{13}$/.test(query.replace(/[^0-9]/g, ''));

    const searchQuery = isISBN ? `isbn:${query.replace(/[^0-9]/g, '')}` : query;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await axios.get(url);
      const books = response.data.items || [];
      if (books.length === 0) {
        setError('No se encontraron resultados para esta búsqueda.');
      }
      onSearch(books);
    } catch (error) {
      console.error('Error buscando libros:', error);
      setError('Hubo un error al buscar. Intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca por título, autor o ISBN (10 o 13 dígitos)"
        className="border p-2 w-full md:w-1/2"
        data-testid="search-input" // Añadido para pruebas
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 ml-2"
        data-testid="search-button" // Añadido para pruebas
      >
        Buscar
      </button>
      {error && (
        <p className="text-red-500 mt-2" data-testid="error-message">
          {error}
        </p>
      )}
    </form>
  );
}