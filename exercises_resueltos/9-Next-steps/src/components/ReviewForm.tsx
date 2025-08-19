'use client';

import { useState } from 'react';
import { Review } from '@/types';

interface ReviewFormProps {
  bookId: string;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        bookId,
        author,
        rating,
        title,
        content
      });
      
      // Reset form on successful submission
      setAuthor('');
      setTitle('');
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Escribe tu reseña</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título de la reseña
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calificación (1-5 estrellas)
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none p-1"
                disabled={isSubmitting}
              >
                <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                  {star <= rating ? '★' : '☆'}
                </span>
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {rating} de 5 estrellas
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Reseña
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Comparte tus pensamientos sobre este libro..."
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;