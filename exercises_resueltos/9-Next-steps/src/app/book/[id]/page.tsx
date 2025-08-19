'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import BookDetails from '@/components/BookDetails';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Book, Review } from '@/types';
import { getBookById } from '@/utils/googleBooks';

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        
        // Fetch reviews from API
        const response = await fetch(`/api/reviews?bookId=${id}`);
        if (response.ok) {
          const reviewsData = await response.json();
          setReviews(reviewsData);
        }
      } catch (err) {
        setError('Error loading book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookAndReviews();
    }
  }, [id]);

  const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
      } else {
        console.error('Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleVote = async (reviewId: string, vote: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, vote }),
      });
      
      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map(review => 
          review.id === reviewId ? updatedReview : review
        ));
      } else {
        console.error('Error voting on review');
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando libro...</p>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Libro no encontrado</h1>
          <p className="mt-4 text-gray-600">El libro que buscas no existe o no está disponible.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BookDetails book={book} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Reseñas de la Comunidad</h2>
            <ReviewList reviews={reviews} onVote={handleVote} />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Escribe tu Reseña</h2>
            <ReviewForm bookId={book.id} onSubmit={handleReviewSubmit} />
          </div>
        </div>
      </main>
    </>
  );
}