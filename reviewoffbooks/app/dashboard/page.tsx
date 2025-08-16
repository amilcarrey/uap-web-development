'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '../types/index';
import { BooksService } from '../bookService';
import SimpleBookCard from '../components/SimpleBookCard';
import BookModal from '../components/BookModal';
import DashboardHeader from '../components/DashboardHeader';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'title' | 'author' | 'isbn'>('title');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      router.push('/welcome');
      return;
    }
    setCurrentUser(savedUser);
  }, [router]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    console.log('🚀 Iniciando búsqueda:', searchQuery, 'tipo:', searchType);
    setLoading(true);
    try {
      let results: Book[] = [];
      
      switch (searchType) {
        case 'author':
          results = await BooksService.searchByAuthor(searchQuery);
          break;
        case 'isbn':
          results = await BooksService.searchByISBN(searchQuery);
          break;
        default:
          results = await BooksService.searchBooks(searchQuery);
      }
      // Log para ver los resultados !
      console.log('📊 Resultados obtenidos:', results.length, 'libros');
      setBooks(results);
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
    setSelectedBook(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    router.push('/welcome');
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-light text-black mb-6 text-center">
            Buscar libros
          </h2>
          <div className="flex gap-3">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black"
            >
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="isbn">ISBN</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar por ${searchType}...`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white text-black"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <SimpleBookCard key={book.id} book={book} onClick={handleBookClick} />
            ))}
          </div>
        )}

        {books.length === 0 && !loading && searchQuery && (
          <div className="text-center text-gray-500 text-lg">
            No se encontraron libros para tu búsqueda.
          </div>
        )}

        {/* Estado inicial */}
        {books.length === 0 && !loading && !searchQuery && (
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-black mb-2">
              ¡Arranca a buscar!
            </h3>
            <p className="text-gray-600">
              Busca tu libro favorito para empezar a calificar y reseñar
            </p>
          </div>
        )}

        {/* Modal del libro */}
        <BookModal
          book={selectedBook}
          isOpen={showBookModal}
          onClose={handleCloseBookModal}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
