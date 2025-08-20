// Client Component para búsqueda
'use client';
//PAGINA DE BUSQUEDA(/search)
// app/page.tsx
import SearchBar from '@/components/SearchBar';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function BookResults() {
  const params = useSearchParams();
  const q = params.get('q');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
  if (!q) return null;
  if (loading) return <div className="mt-8 text-center pastel-author animate-pulse">Buscando libros...</div>;
  if (!books.length) return <div className="mt-8 text-center pastel-title">No se encontraron resultados.</div>;
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {books.map((b: any) => (
        <li key={b.id}>
          <a href={`/book/${b.id}`} className="pastel-card p-4 flex gap-4 hover:scale-[1.03] transition-transform block">
            {b.volumeInfo.imageLinks?.thumbnail && (
              <img src={b.volumeInfo.imageLinks.thumbnail} alt={b.volumeInfo.title} className="w-20 h-28 object-cover rounded-xl border-2 border-blue-100 shadow-sm" />
            )}
            <div className="flex-1">
              <h3 className="pastel-title text-lg mb-1">{b.volumeInfo.title}</h3>
              <p className="pastel-author text-sm mb-1">{b.volumeInfo.authors?.join(', ')}</p>
              <p className="pastel-date text-xs mb-2">{b.volumeInfo.publishedDate}</p>
              <p className="pastel-desc mt-2 text-sm">{b.volumeInfo.description?.slice(0, 120)}...</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
export default function SearchPage() {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4 bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 rounded-3xl shadow-xl border-2 border-blue-100">
      <h1 className="text-5xl font-extrabold tracking-tight mb-6" style={{ color: '#6c2bd7' }}>
        Descubrí, calificá y compartí libros
      </h1>
      <SearchBar />
  <p className="text-xs" style={{ color: '#6c2bd7' }}>Ejemplos: <em>harry potter</em> · <em>inauthor:rowling</em> · <em>isbn:9780439708180</em></p>
      <Suspense>
        <BookResults />
      </Suspense>
    </section>
  );
}
