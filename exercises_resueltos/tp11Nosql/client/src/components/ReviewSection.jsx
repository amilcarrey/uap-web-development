import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const ReviewSection = ({ bookId }) => {
  const { reviews, addReview, voteReview } = useReviews(bookId);
  const { user } = useAuth();

  return (
    <div className="review-section">
      <h2>Community Reviews</h2>
      {user ? (
        <ReviewForm onSubmit={addReview} />
      ) : (
        <div className="login-prompt">
          <p>Please <Link to="/login">login</Link> to write a review.</p>
        </div>
      )}
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
        .login-prompt {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .login-prompt a {
            color: #007bff;
            font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ReviewSection;
