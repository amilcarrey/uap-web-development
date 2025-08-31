'use client'

import { useState, useEffect } from 'react';
import Toast from './Toast';

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  language?: string;
}

interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  rating: number;
  content: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
}

export default function BookModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(true);

  useEffect(() => {
    const handleBookClick = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const bookId = customEvent.detail;
      console.log('BookModal: Recibido evento openBookModal con bookId:', bookId);
      
      setLoading(true);
      setIsOpen(true);
      setShowReviewForm(true);
      setUserReview(null);
      
      try {
        console.log('BookModal: Haciendo fetch a /api/books/', bookId);
        const response = await fetch(`/api/books/${encodeURIComponent(bookId)}`);
        console.log('BookModal: Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('BookModal: Error response:', errorText);
          throw new Error(`Error al cargar el libro: ${response.status}`);
        }
        
        const bookData = await response.json();
        console.log('BookModal: Datos del libro recibidos:', bookData);
        setBook(bookData);
        
        // Verificar si ya existe una reseña para este libro
        const existingReviews = localStorage.getItem('book_reviews_v1');
        if (existingReviews) {
          const reviews = JSON.parse(existingReviews);
          const existingReview = reviews.find((r: Review) => r.bookId === bookId);
          if (existingReview) {
            setUserReview(existingReview);
            setShowReviewForm(false);
          }
        }
      } catch (error) {
        console.error('BookModal: Error loading book:', error);
        setToastMessage(`Error al cargar la información del libro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setToastType('error');
        setShowToast(true);
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
      // Save to localStorage instead of API
      const newReview = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        bookId: book.id,
        bookTitle: book.title,
        bookThumbnail: book.thumbnail,
        rating,
        content: review.trim(),
        createdAt: new Date().toISOString()
      };

      const existingReviews = localStorage.getItem('book_reviews_v1');
      const reviews = existingReviews ? JSON.parse(existingReviews) : [];
      reviews.unshift(newReview);
      localStorage.setItem('book_reviews_v1', JSON.stringify(reviews));

      // Disparar evento personalizado para notificar que se agregó una nueva reseña
      const event = new CustomEvent('reviewAdded', { detail: newReview });
      window.dispatchEvent(event);

      // Mostrar toast de éxito
      setToastMessage('¡Reseña publicada con éxito!');
      setToastType('success');
      setShowToast(true);

      // Mostrar la reseña publicada
      setUserReview(newReview);
      setShowReviewForm(false);
      setRating(0);
      setReview('');
    } catch (error) {
      setToastMessage('Error al publicar la reseña');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleEditReview = () => {
    setShowReviewForm(true);
    setUserReview(null);
    setRating(0);
    setReview('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div role="dialog" className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-amber-50 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-amber-900 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-amber-700 rounded mb-2"></div>
                    <div className="h-4 bg-amber-700 rounded w-2/3"></div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-2">{book?.title}</h1>
                    <p className="text-amber-200">{book?.authors?.join(', ') || 'Autor desconocido'}</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-200 hover:text-white transition-colors"
                aria-label="close"
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
                  <div className="w-32 h-48 bg-amber-200 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-amber-200 rounded"></div>
                    <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                    <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-amber-200 rounded"></div>
                  <div className="h-4 bg-amber-200 rounded"></div>
                  <div className="h-4 bg-amber-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : book ? (
              <>
                {/* Book Info */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} className="w-32 h-48 object-cover rounded border border-amber-200" />
                    ) : (
                      <div className="w-32 h-48 bg-amber-200 rounded flex items-center justify-center border border-amber-300">
                        <svg data-testid="book-placeholder" className="w-12 h-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="text-sm text-amber-800">
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
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Descripción</h3>
                    <p className="text-amber-800 leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* User Review Section */}
                <div className="border-t border-amber-200 pt-6">
                  {userReview ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-amber-900">Tu Reseña</h3>
                        <button
                          onClick={handleEditReview}
                          className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                        >
                          Editar
                        </button>
                      </div>
                      
                      <div className="bg-white border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-amber-500 font-semibold">{userReview.rating}★</div>
                          <span className="text-amber-600 text-sm">{new Date(userReview.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-amber-800">{userReview.content}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-amber-900 mb-4">Deja tu reseña</h3>
                      
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">Calificación</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-colors ${
                                  star <= rating ? 'text-amber-500' : 'text-amber-300 hover:text-amber-400'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">Tu reseña</label>
                          <textarea 
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4} 
                            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900"
                            placeholder="Comparte tu opinión sobre este libro..."
                            required
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            type="submit" 
                            className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
                          >
                            Publicar Reseña
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsOpen(false)}
                            className="bg-amber-200 text-amber-900 px-6 py-2 rounded-lg hover:bg-amber-300 transition-colors"
                          >
                            Cerrar
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-amber-800">
                <p>Error al cargar la información del libro</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
