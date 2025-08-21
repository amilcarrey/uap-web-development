'use client';

import { useState } from 'react';
import { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
  onVote: (reviewId: string, vote: 'upvote' | 'downvote') => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onVote }) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [votingReview, setVotingReview] = useState<string | null>(null);

  const toggleExpand = (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };

  const handleVote = async (reviewId: string, vote: 'upvote' | 'downvote') => {
    setVotingReview(reviewId);
    try {
      await onVote(reviewId, vote);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingReview(null);
    }
  };

  // Sort reviews by helpfulness (upvotes - downvotes)
  const sortedReviews = [...reviews].sort((a, b) => {
    const aScore = a.upvotes - a.downvotes;
    const bScore = b.upvotes - b.downvotes;
    return bScore - aScore;
  });

  if (sortedReviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Aún no hay reseñas para este libro.</p>
        <p className="text-sm text-gray-500 mt-2">Sé el primero en compartir tu opinión.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold">{review.title}</h4>
            <div className="flex text-yellow-400">
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Por: <span className="font-medium">{review.author}</span></p>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="mb-4">
            <p className={expandedReview === review.id ? '' : 'line-clamp-3'}>
              {review.content}
            </p>
            {review.content.length > 200 && (
              <button
                onClick={() => toggleExpand(review.id)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1"
              >
                {expandedReview === review.id ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleVote(review.id, 'upvote')}
                disabled={votingReview === review.id}
                className={`flex items-center ${votingReview === review.id ? 'text-gray-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}
                title="Útil"
              >
                <span className="text-lg">↑</span>
                <span className="ml-1">{review.upvotes}</span>
              </button>
              
              <button
                onClick={() => handleVote(review.id, 'downvote')}
                disabled={votingReview === review.id}
                className={`flex items-center ${votingReview === review.id ? 'text-gray-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                title="No útil"
              >
                <span className="text-lg">↓</span>
                <span className="ml-1">{review.downvotes}</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {review.upvotes - review.downvotes} personas encontraron esta reseña útil
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;