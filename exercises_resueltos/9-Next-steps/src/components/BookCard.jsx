import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const { id, volumeInfo } = book;
    const { title, authors, imageLinks } = volumeInfo;
    const thumbnail = imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';

    return (
        <Link to={`/book/${id}`} className="book-card">
            <div className="book-cover-container">
                <img src={thumbnail} alt={title} className="book-cover" />
            </div>
            <div className="book-info">
                <h3 className="book-title">{title}</h3>
                <p className="book-author">{authors?.join(', ') || 'Unknown Author'}</p>
            </div>
            <style>{`
        .book-card {
          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          height: 100%;
        }
        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }
        .book-cover-container {
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .book-cover {
          height: 100%;
          width: auto;
          object-fit: cover;
        }
        .book-info {
          padding: 1rem;
        }
        .book-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .book-author {
          font-size: 0.875rem;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </Link>
    );
};

export default BookCard;
