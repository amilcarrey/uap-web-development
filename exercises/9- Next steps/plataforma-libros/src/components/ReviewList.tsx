'use client';

import { useState, useEffect } from 'react';
import { getReviews, voteReview } from '../lib/localStorage';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function ReviewList({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setReviews(getReviews(bookId).sort((a, b) => b.votes - a.votes));
  }, [bookId]);

  const handleVote = (reviewId: number, delta: number) => {
    voteReview(bookId, reviewId, delta);
    setReviews(getReviews(bookId).sort((a, b) => b.votes - a.votes));
  };

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 mb-4">
          <p data-testid="review-name">Por: {review.name || 'Anónimo'}</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <p>{review.text}</p>
          <div className="flex mt-2">
            <button
              data-testid="thumbs-up"
              aria-label="Votar positivo"
              onClick={() => handleVote(review.id, 1)}
              className="mr-2"
            >
              <FaThumbsUp /> {review.votes > 0 ? `+${review.votes}` : review.votes}
            </button>
            <button
              data-testid="thumbs-down"
              aria-label="Votar negativo"
              onClick={() => handleVote(review.id, -1)}
            >
              <FaThumbsDown />
            </button>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p data-testid="no-reviews">No hay reseñas aún.</p>}
    </div>
  );
}