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

  // Ordenar reviews por utilidad (upvotes - downvotes) y luego por fecha (más recientes primero)
  const sortedReviews = [...reviews].sort((a, b) => {
    const aScore = a.upvotes - a.downvotes;
    const bScore = b.upvotes - b.downvotes;
    
    if (bScore !== aScore) {
      return bScore - aScore;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      {sortedReviews.map((review) => {
        const helpfulScore = review.upvotes - review.downvotes;
        const isVoting = votingReview === review.id;
        
        return (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-800">{review.title}</h4>
              <div className="flex text-yellow-400 text-lg">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <p className="text-gray-600 text-sm">
                Por: <span className="font-medium">{review.author}</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="mb-4">
              <p className={`text-gray-700 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}>
                {review.content}
              </p>
              {review.content.length > 200 && (
                <button
                  onClick={() => toggleExpand(review.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                >
                  {expandedReview === review.id ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(review.id, 'upvote')}
                  disabled={isVoting}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md border transition-colors ${
                    isVoting
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title="Esta reseña es útil"
                >
                  <span className="text-lg">👍</span>
                  <span className="font-medium">{review.upvotes}</span>
                </button>
                
                <button
                  onClick={() => handleVote(review.id, 'downvote')}
                  disabled={isVoting}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md border transition-colors ${
                    isVoting
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Esta reseña no es útil"
                >
                  <span className="text-lg">👎</span>
                  <span className="font-medium">{review.downvotes}</span>
                </button>
              </div>
              
              {helpfulScore > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  {helpfulScore} persona{helpfulScore !== 1 ? 's' : ''} encontraron esta reseña útil
                </div>
              )}
              
              {helpfulScore === 0 && review.upvotes > 0 && (
                <div className="text-sm text-gray-500">
                  {review.upvotes} voto{review.upvotes !== 1 ? 's' : ''}
                </div>
              )}
              
              {helpfulScore < 0 && (
                <div className="text-sm text-red-600">
                  {Math.abs(helpfulScore)} persona{Math.abs(helpfulScore) !== 1 ? 's' : ''} no encontraron útil esta reseña
                </div>
              )}
            </div>
            
            {isVoting && (
              <div className="mt-3 text-sm text-blue-600">
                Procesando voto...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;