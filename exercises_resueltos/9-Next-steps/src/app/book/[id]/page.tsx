'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import BookDetails from '@/components/BookDetails';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import Pagination from '@/components/Pagination';
import { Book, Review } from '@/types';
import { getBookById } from '@/utils/googleBooks';

const REVIEWS_PER_PAGE = 5;

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        
        if (!bookData) {
          setError('Libro no encontrado');
          setLoading(false);
          return;
        }
        
        setBook(bookData);
        
        // Fetch reviews from API con paginación
        const response = await fetch(
          `/api/reviews?bookId=${id}&page=${currentPage}&limit=${REVIEWS_PER_PAGE}`
        );
        
        if (response.ok) {
          const reviewsData = await response.json();
          setReviews(reviewsData.data);
          setTotalReviews(reviewsData.total);
        } else {
          console.error('Error fetching reviews');
        }
      } catch (err) {
        setError('Error cargando detalles del libro');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookAndReviews();
    }
  }, [id, currentPage]);

  const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => {
    try {
      setSubmittingReview(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        const newReview = await response.json();
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setTotalReviews(prevTotal => prevTotal + 1);
        setCurrentPage(1); // Volver a la primera página para ver la nueva reseña
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar la reseña');
    } finally {
      setSubmittingReview(false);
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
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId ? updatedReview : review
          )
        );
      } else {
        console.error('Error voting on review');
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

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
          <a 
            href="/search" 
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar Libros
          </a>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Reseñas de la Comunidad</h2>
              {totalReviews > 0 && (
                <span className="text-gray-600">
                  {totalReviews} reseña{totalReviews !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <ReviewList reviews={reviews} onVote={handleVote} />
            
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalReviews}
                  itemsPerPage={REVIEWS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Escribe tu Reseña</h2>
            <ReviewForm 
              bookId={book.id} 
              onSubmit={handleReviewSubmit}
            />
            {submittingReview && (
              <div className="mt-4 text-blue-600">Enviando reseña...</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}