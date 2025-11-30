import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useReviews } from '../hooks/useReviews';

const ReviewSection = ({ bookId }) => {
    const { reviews, addReview, voteReview } = useReviews(bookId);

    return (
        <div className="review-section">
            <h2>Community Reviews</h2>
            <ReviewForm onSubmit={addReview} />
            <ReviewList reviews={reviews} onVote={voteReview} />
            <style>{`
        .review-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
        }
        .review-section h2 {
          margin-bottom: 1.5rem;
        }
      `}</style>
        </div>
    );
};

export default ReviewSection;
