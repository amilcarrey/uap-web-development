'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  useEffect(() => {
    // Cargar reseñas desde la API
    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews?userId=current', {
          credentials: 'include' // Incluir cookies para autenticación
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.reviews) {
            setReviews(data.data.reviews);
          }
        } else if (response.status === 401) {
          // Usuario no autenticado, mostrar reseñas vacías
          setReviews([]);
        } else {
          console.error('Error al cargar reseñas:', response.statusText);
        }
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();

    // Escuchar evento de nueva reseña creada
    const handleReviewCreated = () => {
      loadReviews();
    };

    window.addEventListener('reviewCreated', handleReviewCreated);
    
    return () => {
      window.removeEventListener('reviewCreated', handleReviewCreated);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-green-800">
        <p className="text-xl">Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-green-800">
        <p className="text-xl mb-4">Aún no has escrito reseñas</p>
        <Link 
          href="/?view=search" 
          className="inline-block bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
        >
          Buscar libros para reseñar
        </Link>
      </div>
    );
  }

  const handleLike = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ voteType: 'like' })
      });

      if (response.ok) {
        // Actualizar el estado local optimísticamente
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
      } else {
        console.error('Error al dar like:', response.statusText);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ voteType: 'dislike' })
      });

      if (response.ok) {
        // Actualizar el estado local optimísticamente
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
      } else {
        console.error('Error al dar dislike:', response.statusText);
      }
    } catch (error) {
      console.error('Error al dar dislike:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-900 mb-6">Mis Reseñas</h2>
      <div className="grid gap-6">
        {reviews.map((review: Review) => (
          <div key={review.id} className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {review.bookThumbnail && (
                <Image 
                  src={review.bookThumbnail} 
                  alt={review.bookTitle} 
                  width={64} 
                  height={96} 
                  className="w-16 h-24 object-cover rounded border border-green-200"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">{review.bookTitle}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-green-500 font-semibold">{review.rating}★</div>
                  <span className="text-green-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-green-800 mb-4">{review.content}</p>
                
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