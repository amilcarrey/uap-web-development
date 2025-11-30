import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const token = user.token;
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Favorites
                const favRes = await fetch('/api/favorites', { headers });
                if (favRes.ok) {
                    const favData = await favRes.json();
                    setFavorites(favData);
                }

                // Fetch Reviews
                const reviewRes = await fetch('/api/reviews/user/me', { headers });
                if (reviewRes.ok) {
                    const reviewData = await reviewRes.json();
                    setReviews(reviewData);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        fetchData();
    }, [user]);

    if (!user) {
        return <div className="profile-container">Please login to view profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {user.name}</h1>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            <div className="favorites-section">
                <h2>My Favorites</h2>
                {favorites.length === 0 ? (
                    <p>No favorites yet.</p>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((fav) => (
                            <div key={fav._id} className="favorite-card">
                                <Link to={`/book/${fav.bookId}`}>
                                    <img src={fav.cover || 'https://via.placeholder.com/128x192'} alt={fav.title} />
                                    <h3>{fav.title}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="reviews-section">
                <h2>My Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review._id} className="review-card">
                                <Link to={`/book/${review.bookId}`}>
                                    <h4>Book ID: {review.bookId}</h4>
                                </Link>
                                <div className="rating">Rating: {review.rating}/5</div>
                                <p>{review.content}</p>
                                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .profile-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1.5rem;
        }
        .favorite-card {
          text-align: center;
        }
        .favorite-card img {
          width: 100%;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .favorite-card h3 {
          font-size: 1rem;
          margin-top: 0.5rem;
          color: #333;
        }
        .reviews-section {
            margin-top: 3rem;
        }
        .review-card {
            background: #f9f9f9;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
            border: 1px solid #eee;
        }
        .review-card h4 {
            margin: 0 0 0.5rem 0;
        }
        .review-card .rating {
            color: #f59e0b;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
      `}</style>
        </div>
    );
};

export default Profile;
