'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { GoogleBook } from '../types';

export default function HomePage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'title' | 'author' | 'isbn'>('title');
  const [searched, setSearched] = useState(false);

  // búsqueda al presionar Enter
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') await search();
  };

  const search = async () => {
  if (!q.trim()) return;
  setSearched(true);
    let query = q.trim();
    if (searchType === 'isbn') {
      query = `isbn:${query}`;
    } else if (searchType === 'author') {
      query = `inauthor:${query}`;
    }
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === 'title'
              ? 'Buscar por título (ej: harry potter)'
              : searchType === 'author'
              ? 'Buscar por autor (ej: rowling)'
              : 'Buscar por ISBN (ej: 9780439708180)'
          }
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value as 'title' | 'author' | 'isbn')}
          className="rounded-lg border px-2 py-2"
        >
          <option value="title">Título</option>
          <option value="author">Autor</option>
          <option value="isbn">ISBN</option>
        </select>
        <button
          onClick={search}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
          disabled={loading}
        >Buscar</button>
      </div>

      {loading && <p>Buscando…</p>}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {searched && !loading && results.length === 0 && (
          <li className="col-span-full text-center text-slate-500 py-8">Sin coincidencias</li>
        )}
        {results.map((b) => {
          const img = b.volumeInfo.imageLinks?.thumbnail;
          return (
            <li key={b.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                {img ? (
                  <img src={img} alt={b.volumeInfo.title} className="h-28 w-20 rounded-md object-cover" />
                ) : (
                  <div className="h-28 w-20 rounded-md bg-slate-200" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{b.volumeInfo.title}</h3>
                  <p className="text-sm text-slate-600">
                    {b.volumeInfo.authors?.join(', ') ?? 'Autor desconocido'}
                  </p>
                  <Link
                    href={`/book/${b.id}`}
                    className="mt-3 inline-block rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-black"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
