'use client'

import { useState, useEffect } from 'react';

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

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem('book_reviews_v1');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    }
  };

  useEffect(() => {
    // Load reviews from localStorage
    loadReviews();
    setLoading(false);

    // Escuchar el evento de nueva reseña agregada
    const handleReviewAdded = () => {
      loadReviews();
    };

    window.addEventListener('reviewAdded', handleReviewAdded);
    
    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-amber-800">
        <p className="text-xl">Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-amber-800">
        <p className="text-xl mb-4">Aún no has escrito reseñas</p>
        <a 
          href="/?view=search" 
          className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Buscar libros para reseñar
        </a>
      </div>
    );
  }

  const handleLike = (reviewId: string) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          likes: (review.likes || 0) + 1
        };
      }
      return review;
    });
    setReviews(updatedReviews);
    localStorage.setItem('book_reviews_v1', JSON.stringify(updatedReviews));
  };

  const handleDislike = (reviewId: string) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          dislikes: (review.dislikes || 0) + 1
        };
      }
      return review;
    });
    setReviews(updatedReviews);
    localStorage.setItem('book_reviews_v1', JSON.stringify(updatedReviews));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Mis Reseñas</h2>
      <div className="grid gap-6">
        {reviews.map((review: Review) => (
          <div key={review.id} className="bg-white border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {review.bookThumbnail && (
                <img 
                  src={review.bookThumbnail} 
                  alt={review.bookTitle} 
                  className="w-16 h-24 object-cover rounded border border-amber-200"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">{review.bookTitle}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-amber-500 font-semibold">{review.rating}★</div>
                  <span className="text-amber-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-amber-800 mb-4">{review.content}</p>
                
                {/* Like/Dislike buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm font-medium">{review.likes || 0}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDislike(review.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                    </svg>
                    <span className="text-sm font-medium">{review.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
