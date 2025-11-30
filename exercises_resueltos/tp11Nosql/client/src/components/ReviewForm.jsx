import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && author.trim()) {
            onSubmit({ rating, text, author });
            setText('');
            setAuthor('');
            setRating(5);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Write a Review</h3>

            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    placeholder="Your name"
                />
            </div>

            <div className="form-group">
                <label>Rating:</label>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= rating ? 'active' : ''}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Review:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    placeholder="Share your thoughts..."
                    rows={4}
                />
            </div>

            <button type="submit" className="submit-btn">Submit Review</button>

            <style>{`
        .review-form {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: var(--radius);
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
        }
        .star-rating {
          display: flex;
          gap: 0.25rem;
        }
        .star-btn {
          font-size: 1.5rem;
          color: #ddd;
          transition: color 0.2s;
        }
        .star-btn.active {
          color: #ffc107;
        }
        .submit-btn {
          background: var(--primary-color);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 600;
        }
        .submit-btn:hover {
          background: var(--primary-hover);
        }
      `}</style>
        </form>
    );
};

export default ReviewForm;
