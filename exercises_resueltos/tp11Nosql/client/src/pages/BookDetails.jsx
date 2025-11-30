import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookDetails } from '../services/api';
import ReviewSection from '../components/ReviewSection';

import { useAuth } from '../hooks/useAuth';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookDetails(id);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;
      try {
        const response = await fetch(`/api/favorites/check/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkFavorite();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      if (isFavorite) {
        await fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setIsFavorite(false);
      } else {
        const { volumeInfo } = book;
        const cover = volumeInfo.imageLinks?.thumbnail;
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            bookId: id,
            title: volumeInfo.title,
            cover,
            authors: volumeInfo.authors
          })
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Book not found.</div>;

  const { volumeInfo } = book;
  const { title, authors, description, imageLinks, publisher, publishedDate, pageCount, categories } = volumeInfo;
  const cover = imageLinks?.large || imageLinks?.medium || imageLinks?.thumbnail || 'https://via.placeholder.com/300x450?text=No+Cover';

  return (
    <div className="book-details-page">
      <div className="header-actions">
        <Link to="/" className="back-link">← Back to Search</Link>
        {user && (
          <button
            onClick={toggleFavorite}
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
          >
            {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
          </button>
        )}
      </div>

      <div className="details-container">
        <div className="cover-section">
          <img src={cover} alt={title} className="main-cover" />
        </div>

        <div className="info-section">
          <h1 className="book-title">{title}</h1>
          <h2 className="book-authors">by {authors?.join(', ') || 'Unknown Author'}</h2>

          <div className="meta-info">
            {publisher && <span><strong>Publisher:</strong> {publisher}</span>}
            {publishedDate && <span><strong>Published:</strong> {publishedDate}</span>}
            {pageCount && <span><strong>Pages:</strong> {pageCount}</span>}
          </div>

          <div className="categories">
            {categories?.map((cat, index) => (
              <span key={index} className="category-tag">{cat}</span>
            ))}
          </div>

          <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>

      <ReviewSection bookId={id} />

      <style>{`
        .book-details-page {
          padding-top: 1rem;
        }
        .header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .back-link {
          color: var(--primary-color);
          font-weight: 600;
        }
        .fav-btn {
            background: white;
            border: 2px solid #e91e63;
            color: #e91e63;
            padding: 0.5rem 1rem;
            border-radius: 100px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }
        .fav-btn.active {
            background: #e91e63;
            color: white;
        }
        .fav-btn:hover {
            transform: scale(1.05);
        }
        .details-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        @media (min-width: 768px) {
          .details-container {
            grid-template-columns: 300px 1fr;
          }
        }
        .main-cover {
          width: 100%;
          height: auto;
          border-radius: var(--radius);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .book-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .book-authors {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #444;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .category-tag {
          background: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.85rem;
          color: #555;
        }
        .description {
          line-height: 1.6;
          color: #333;
        }
        .loading, .error {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default BookDetails;
