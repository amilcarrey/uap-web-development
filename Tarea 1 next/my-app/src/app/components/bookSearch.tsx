// src/app/components/BookSearch.tsx
'use client';
import { useState } from 'react';

export default function BookSearch({ onSelectBook }: { onSelectBook: (book: any) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState<{ [id: string]: boolean }>({});

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.items || []);
    setShowDetails({});
  };

  const handleShowDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form onSubmit={searchBooks} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por título, autor o ISBN"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buscar</button>
      </form>
      <ul className="space-y-4">
        {results.map(book => (
          <li key={book.id} className="flex items-center gap-4 bg-white shadow rounded p-4">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || ''}
              alt={book.volumeInfo.title}
              className="w-16 h-24 object-cover rounded border"
            />
            <div className="flex-1">
              <div className="font-semibold text-lg text-black">{book.volumeInfo.title}</div>
              <div className="text-gray-900 text-sm mb-2">{book.volumeInfo.authors?.join(', ')}</div>
              <button
                className="text-blue-600 underline text-sm mb-2"
                onClick={() => handleShowDetails(book.id)}
              >
                {showDetails[book.id] ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
              {showDetails[book.id] && (
                <div className="mt-2 text-sm bg-gray-50 p-2 rounded text-black">
                  <div><b>Publicado:</b> {book.volumeInfo.publishedDate}</div>    
                  <div><b>Categorías:</b> {book.volumeInfo.categories?.join(', ')}</div>
                  <div><b>Descripción:</b> {book.volumeInfo.description?.slice(0, 300) || 'Sin descripción'}...</div>
                  <button
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => onSelectBook(book)}
                  >
                    Seleccionar libro
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}