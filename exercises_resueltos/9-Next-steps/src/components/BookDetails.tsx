import { useState } from 'react'
import { Book, Review } from '@/types'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'

interface BookDetailsProps {
  book: Book;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'votes'>) => void;
  onVote: (reviewId: string, increment: number) => void;
}

export default function BookDetails({ book, reviews, onAddReview, onVote }: BookDetailsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="flex justify-center mb-6">
        {book.imageUrl ? (
          <img
            src={book.imageUrl.replace('http:', 'https:')}
            alt={book.title}
            className="w-48 h-72 object-cover rounded shadow-lg"
          />
        ) : (
          <div className="w-48 h-72 bg-gray-200 rounded shadow-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
      <p className="text-lg text-gray-600 mb-4">por {book.authors.join(', ')}</p>

      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <span className="text-yellow-400 text-2xl">★</span>
          <span className="ml-1 text-gray-700 font-semibold">{averageRating}</span>
        </div>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-gray-600">{reviews.length} reseñas</span>
      </div>

      <div className="space-y-3 mb-6">
        {book.publishedDate && (
          <p className="text-gray-600">
            <span className="font-semibold">Publicación:</span> {new Date(book.publishedDate).toLocaleDateString()}
          </p>
        )}
        {book.pageCount && (
          <p className="text-gray-600">
            <span className="font-semibold">Páginas:</span> {book.pageCount}
          </p>
        )}
        {book.isbn && (
          <p className="text-gray-600">
            <span className="font-semibold">ISBN:</span> {book.isbn}
          </p>
        )}
        {book.categories.length > 0 && (
          <div>
            <span className="font-semibold text-gray-600">Categorías:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {book.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {book.description && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {book.description.length > 300
              ? `${book.description.substring(0, 300)}...`
              : book.description
            }
          </p>
        </div>
      )}

      <button
        onClick={() => setShowReviewForm(!showReviewForm)}
        className="w-full mb-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        {showReviewForm ? 'Cancelar' : 'Escribir Reseña'}
      </button>

      {showReviewForm && (
        <ReviewForm 
          onSubmit={onAddReview} 
          onCancel={() => setShowReviewForm(false)}
          bookId={book.id} // Pasar el bookId
        />
      )}  

      <ReviewList reviews={reviews} onVote={onVote} />
    </div>
  )
}