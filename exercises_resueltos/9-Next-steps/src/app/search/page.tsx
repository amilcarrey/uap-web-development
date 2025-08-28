'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import Pagination from '@/components/Pagination';
import { Book } from '@/types';
import { searchBooks } from '@/utils/googleBooks';

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [actualTotal, setActualTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setLoading(true);
        setError(null);
        
        try {
          const { 
            books: results, 
            totalItems: total, 
            hasMore: moreResults,
            actualTotal: realTotal 
          } = await searchBooks(query, {
            page: currentPage,
            limit: ITEMS_PER_PAGE
          });
          
          setBooks(results);
          setTotalItems(total);
          setHasMore(moreResults);
          setActualTotal(realTotal);
        } catch (err) {
          setError('Error al buscar libros');
          console.error('Error searching books:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setBooks([]);
        setTotalItems(0);
        setHasMore(false);
        setActualTotal(0);
      }
    };

    performSearch();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  // Calcular el total real de páginas
  const calculateTotalPages = () => {
    if (actualTotal === 0) return 0;
    
    // Si no hay más resultados, estamos en la última página
    if (!hasMore && books.length > 0) {
      return currentPage;
    }
    
    return Math.ceil(actualTotal / ITEMS_PER_PAGE);
  };

  const totalPages = calculateTotalPages();
  const isLastPage = currentPage === totalPages;
  const showingAllResults = !hasMore && books.length > 0;

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Buscando libros...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {query ? `Resultados para "${query}"` : 'Busca libros por título, autor o ISBN'}
            </h2>
            
            {books.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {actualTotal.toLocaleString()} resultado{actualTotal !== 1 ? 's' : ''} encontrado{actualTotal !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                <div className="flex flex-col gap-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={actualTotal}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                  
                  {showingAllResults && isLastPage && (
                    <p className="text-center text-gray-600 text-sm">
                      Mostrando todos los {actualTotal.toLocaleString()} resultados disponibles
                    </p>
                  )}
                  
                  {hasMore && (
                    <p className="text-center text-gray-600 text-sm">
                      {Math.min(1000 - (currentPage * ITEMS_PER_PAGE), ITEMS_PER_PAGE).toLocaleString()} resultados más disponibles
                    </p>
                  )}
                </div>
              </>
            ) : (
              query && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se encontraron libros para "{query}"</p>
                </div>
              )
            )}
          </>
        )}
      </main>
    </>
  );
}