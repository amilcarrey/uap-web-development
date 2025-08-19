import { Suspense } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import { Book } from '@/types';
import { searchBooks } from '@/utils/googleBooks';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = searchParams;
  let books: Book[] = [];
  
  if (q) {
    books = await searchBooks(q);
  }

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar />
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Buscando libros...</p>
          </div>
        }>
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {q ? `Resultados para "${q}"` : 'Busca libros por título, autor o ISBN'}
            </h2>
            
            {books.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              q && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se encontraron libros para "{q}"</p>
                </div>
              )
            )}
          </>
        </Suspense>
      </main>
    </>
  );
}