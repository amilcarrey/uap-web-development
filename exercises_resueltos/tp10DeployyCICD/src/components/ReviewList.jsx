import React from 'react';

const ReviewList = ({ reviews, onVote }) => {
    if (!reviews || reviews.length === 0) {
        return <div className="no-reviews">No reviews yet. Be the first to write one!</div>;
    }

    return (
        <div className="review-list">
            {reviews.map((review) => (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <span className="review-author">{review.author}</span>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <div className="review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="review-text">{review.text}</p>
                    <div className="review-footer">
                        <div className="vote-controls">
                            <button onClick={() => onVote(review.id, 1)} className="vote-btn upvote">
                                ▲
                            </button>
                            <span className="vote-count">{review.votes}</span>
                            <button onClick={() => onVote(review.id, -1)} className="vote-btn downvote">
                                ▼
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <style>{`
        .review-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .review-item {
          background: white;
          padding: 1rem;
          border-radius: var(--radius);
          border: 1px solid #eee;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        .review-author {
          font-weight: 600;
          color: var(--text-color);
        }
        .review-rating {
          color: #ffc107;
          margin-bottom: 0.5rem;
        }
        .review-text {
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .review-footer {
          display: flex;
          justify-content: flex-end;
        }
        .vote-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f5f5f5;
          padding: 0.25rem 0.5rem;
          border-radius: 100px;
        }
        .vote-btn {
          font-size: 0.8rem;
          padding: 0.25rem;
          color: #666;
        }
        .vote-btn:hover {
          color: var(--primary-color);
        }
        .vote-count {
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }
        .no-reviews {
          text-align: center;
          color: #888;
          padding: 2rem;
          font-style: italic;
        }
      `}</style>
        </div>
    );
};

export default ReviewList;
