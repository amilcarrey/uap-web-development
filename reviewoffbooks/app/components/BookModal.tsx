'use client';

import { useState, useEffect } from 'react';
import { Book, Review } from '../types/index';
import StarRating from './StarRating';
import { ReviewsService } from '../reviewService';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: string | null;
}

export default function BookModal({ book, isOpen, onClose, currentUser }: BookModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      const bookReviews = ReviewsService.getReviewsForBook(book.id);
      setReviews(bookReviews);
      
      const existingReview = bookReviews.find(review => review.author === currentUser);
      if (existingReview) {
        setUserReview(existingReview);
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      } else {
        setUserReview(null);
        setRating(0);
        setComment('');
      }
      
      const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
      setIsSaved(savedBooks.some((savedBook: any) => savedBook.id === book.id));
    }
  }, [book, isOpen, currentUser]);

  const handleSubmitReview = () => {
    if (!book || !currentUser || rating === 0) return;

    if (userReview) {
      // Actualizar reseña existente
      ReviewsService.updateReview(userReview.id, { rating, comment });
    } else {
             // Crear nueva reseña
       ReviewsService.addReview({
         bookId: book.id,
         bookTitle: book.volumeInfo.title,
         rating,
         comment,
         author: currentUser
       });
    }

    // Recargar reseñas
    const updatedReviews = ReviewsService.getReviewsForBook(book.id);
    setReviews(updatedReviews);
    
    // Limpiar formulario
    setRating(0);
    setComment('');
    setUserReview(null);
  };

  const handleVote = (reviewId: string, vote: 'up' | 'down') => {
    ReviewsService.voteReview(reviewId, vote);
    const updatedReviews = ReviewsService.getReviewsForBook(book!.id);
    setReviews(updatedReviews);
  };

  const toggleSaveBook = () => {
    if (!book) return;
    
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
    
    if (isSaved) {
      // Remover libro
      const updatedBooks = savedBooks.filter((savedBook: any) => savedBook.id !== book.id);
      localStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
      setIsSaved(false);
    } else {
      // Guardar libro
      savedBooks.push(book);
      localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
      setIsSaved(true);
    }
  };

  if (!isOpen || !book) return null;

  const { volumeInfo } = book;
  const coverImage = volumeInfo.imageLinks?.thumbnail || '/next.svg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
                     {/* Header */}
           <div className="flex justify-between items-start mb-6">
             <h2 className="text-2xl font-light text-black">
               {volumeInfo.title}
             </h2>
             <div className="flex items-center gap-2">
               <button
                 onClick={toggleSaveBook}
                 className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                   isSaved 
                     ? 'bg-black text-white' 
                     : 'bg-gray-100 text-black hover:bg-gray-200'
                 }`}
               >
                 {isSaved ? '📚 Guardado' : '📚 Guardar'}
               </button>
               <button
                 onClick={onClose}
                 className="text-gray-400 hover:text-black text-2xl"
               >
                 ×
               </button>
             </div>
           </div>

          {/* Contenido del libro */}
          <div className="flex gap-6 mb-8">
            <div className="flex-shrink-0">
              <img
                src={coverImage}
                alt={volumeInfo.title}
                className="w-32 h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex-1">
              {volumeInfo.authors && (
                <p className="text-gray-600 mb-3">
                  <strong>Autor:</strong> {volumeInfo.authors.join(', ')}
                </p>
              )}
              {volumeInfo.publishedDate && (
                <p className="text-gray-600 mb-3">
                  <strong>Publicado:</strong> {volumeInfo.publishedDate}
                </p>
              )}
              {volumeInfo.pageCount && (
                <p className="text-gray-600 mb-3">
                  <strong>Páginas:</strong> {volumeInfo.pageCount}
                </p>
              )}
              {volumeInfo.description && (
                <div className="mb-4">
                  <strong className="text-black">Descripción:</strong>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {volumeInfo.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sistema de calificación */}
          {currentUser && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-black mb-4">
                {userReview ? 'Editar tu calificación' : 'Calificar este libro'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu calificación
                  </label>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    readonly={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu comentario
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none text-black"
                    rows={3}
                    placeholder="Comparte tu opinión sobre este libro..."
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {userReview ? 'Actualizar reseña' : 'Enviar reseña'}
                </button>
              </div>
            </div>
          )}

          {/* Reseñas existentes */}
          {reviews.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-black mb-4">
                Reseñas ({reviews.length})
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-black">{review.author}</p>
                        <StarRating rating={review.rating} readonly />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(review.id, 'up')}
                          className="text-sm text-gray-500 hover:text-black"
                        >
                          👍 {review.upvotes}
                        </button>
                        <button
                          onClick={() => handleVote(review.id, 'down')}
                          className="text-sm text-gray-500 hover:text-black"
                        >
                          👎 {review.downvotes}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
