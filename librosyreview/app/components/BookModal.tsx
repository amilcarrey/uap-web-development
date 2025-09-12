'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getBookById } from '../actions/books';
import { DetailedBook } from '../lib/book-utils'; // Importar la interfaz existente

// Eliminar la interfaz Book local y usar DetailedBook
export default function BookModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [book, setBook] = useState<DetailedBook | null>(null); // Usar DetailedBook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Agregar estado de error
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Marcar como montado para evitar problemas de hidratación
    setMounted(true);
    
    const handleBookClick = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const bookId = customEvent.detail;
      
      // Resetear estados
      setLoading(true);
      setIsOpen(true);
      setBook(null);
      setError(null);
      setImageError(false);
      
      try {
        console.log('Cargando libro con ID:', bookId); // Debug
        const bookData = await getBookById(bookId);
        
        if (bookData) {
          console.log('Libro cargado exitosamente:', bookData.title); // Debug
          setBook(bookData);
          setError(null);
        } else {
          console.log('No se pudo obtener datos del libro'); // Debug
          setError('No se pudo cargar la información del libro');
          setBook(null);
        }
      } catch (error) {
        console.error('Error loading book:', error);
        setError('Error al cargar la información del libro');
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('openBookModal', handleBookClick);
    return () => {
      window.removeEventListener('openBookModal', handleBookClick);
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !rating || !review.trim()) return;

    try {
      // Enviar reseña a la API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies para autenticación
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookThumbnail: book.thumbnail,
          rating,
          content: review.trim(),
          bookAuthor: book.authors?.join(', ') || 'Autor desconocido',
          bookImage: book.thumbnail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 401) {
          alert('Debes iniciar sesión para escribir una reseña');
          return;
        }
        if (response.status === 409) {
          alert('Ya has reseñado este libro anteriormente');
          return;
        }
        throw new Error(data.message || 'Error al publicar la reseña');
      }

      alert('¡Reseña publicada con éxito!');
      setRating(0);
      setReview('');
      
      // Disparar evento personalizado para actualizar la lista de reseñas
      window.dispatchEvent(new CustomEvent('reviewCreated'));
    } catch (error) {
      console.error('Error al publicar reseña:', error);
      alert(error instanceof Error ? error.message : 'Error al publicar la reseña');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-green-50 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-900 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-green-700 rounded mb-2"></div>
                  <div className="h-4 bg-green-700 rounded w-2/3"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2">{book?.title}</h1>
                  <p className="text-green-200">{book?.authors?.join(', ') || 'Autor desconocido'}</p>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-green-200 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex gap-6">
                <div className="w-32 h-48 bg-green-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-green-200 rounded"></div>
                  <div className="h-4 bg-green-200 rounded w-3/4"></div>
                  <div className="h-4 bg-green-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-green-200 rounded"></div>
                <div className="h-4 bg-green-200 rounded"></div>
                <div className="h-4 bg-green-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-green-800 py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">{error}</p>
              <p className="text-sm text-green-600 mb-4">Por favor, intenta nuevamente más tarde</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : book ? (
            <>
              {/* Book Info */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {mounted && book.thumbnail && !imageError ? (
                    <Image 
                      src={book.thumbnail} 
                      alt={book.title} 
                      width={128} 
                      height={192} 
                      className="w-32 h-48 object-cover rounded border border-green-200"
                      onError={() => setImageError(true)}
                      unoptimized
                    />
                  ) : (
                    <div className="w-32 h-48 bg-green-200 rounded flex items-center justify-center border border-green-300">
                      <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="text-sm text-green-800">
                    <p><strong>Publicado:</strong> {book.publishedDate || 'N/D'}</p>
                    <p><strong>Páginas:</strong> {book.pageCount || 'N/D'}</p>
                    <p><strong>Editorial:</strong> {book.publisher || 'N/D'}</p>
                    <p><strong>Idioma:</strong> {book.language || 'N/D'}</p>
                    <p><strong>Categorías:</strong> {book.categories?.join(', ') || 'N/D'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Descripción</h3>
                  <p className="text-green-800 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Review Form */}
              <div className="border-t border-green-200 pt-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Deja tu reseña</h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-colors ${
                            star <= rating ? 'text-green-500' : 'text-green-300 hover:text-green-400'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">Tu reseña</label>
                    <textarea 
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4} 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-900"
                      placeholder="Comparte tu opinión sobre este libro..."
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
                    >
                      Publicar Reseña
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)}
                      className="bg-green-200 text-green-900 px-6 py-2 rounded-lg hover:bg-green-300 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center text-green-800 py-8">
              <p>Cargando información del libro...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}