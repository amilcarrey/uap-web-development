// --- Página de búsqueda de libros ---
// Permite buscar libros y ver resultados usando la API de Google Books
'use client';

import SearchBar from '@/components/SearchBar';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Componente que muestra los resultados de la búsqueda
function BookResults() {
  const params = useSearchParams();
  const q = params.get('q');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cuando cambia la query, hago la búsqueda llamando al endpoint interno
  useEffect(() => {
    if (!q) return setBooks([]);
    setLoading(true);
    fetch(`/api/books?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.items || []);
        setLoading(false);
      });
  }, [q]);

  // Distintos estados: sin query, cargando, sin resultados, o lista de libros
  if (!q) return null;
  if (loading) return <div className="mt-8 text-center text-gray-600 animate-pulse">Buscando libros...</div>;
  if (!books.length) return <div className="mt-8 text-center text-gray-900">No se encontraron resultados.</div>;

  // Renderizo la grilla de libros encontrados
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {books.map((b: any) => (
        <li key={b.id}>
          <a
            href={`/book/${b.id}`}
            className="group block rounded-2xl border border-violet-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm
                       hover:shadow-[0_16px_40px_-16px_rgba(139,77,255,.35)] hover:-translate-y-0.5 transition"
          >
            <div className="flex gap-4">
              {b.volumeInfo.imageLinks?.thumbnail ? (
                <img
                  src={b.volumeInfo.imageLinks.thumbnail}
                  alt={b.volumeInfo.title}
                  className="w-20 h-28 object-cover rounded-xl border border-violet-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-28 rounded-xl border border-violet-100 bg-[#ede6ff] grid place-items-center text-xs text-violet-700/70">
                  Sin portada
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 text-lg mb-1 font-semibold group-hover:underline line-clamp-2">
                  {b.volumeInfo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-1 line-clamp-1">{b.volumeInfo.authors?.join(', ')}</p>
                <p className="text-gray-500 text-xs">{b.volumeInfo.publishedDate}</p>
                {b.volumeInfo.description && (
                  <p className="mt-2 text-gray-700 text-sm line-clamp-3">{b.volumeInfo.description}</p>
                )}
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Componente principal de la página de búsqueda
export default function SearchPage() {
  return (
    <section className="max-w-5xl mx-auto py-10 px-4 rounded-3xl bg-white/60 border border-violet-100 shadow-[0_20px_80px_-20px_rgba(139,77,255,.25)] backdrop-blur-xl">
      <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-gray-900">
        Descubrí, calificá y compartí libros
      </h1>
      <SearchBar />
      <p className="mt-2 text-xs text-violet-700">Ejemplos: <em>harry potter</em> · <em>inauthor:rowling</em> · <em>isbn:9780439708180</em></p>
      <Suspense>
        <BookResults />
      </Suspense>
    </section>
  );
}
