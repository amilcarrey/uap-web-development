import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/api';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const results = await searchBooks(query);
            setBooks(results);
        } catch (err) {
            setError('Failed to fetch books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Discover Your Next Favorite Book</h1>
                <p>Search through millions of books using Google Books API</p>
                <div className="search-container">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            <div className="results-section">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && (
                    <>
                        {books.length > 0 ? (
                            <div className="books-grid">
                                {books.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        ) : (
                            searched && <div className="no-results">No books found. Try a different search.</div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .hero-section {
          text-align: center;
          padding: 3rem 1rem;
          background: linear-gradient(135deg, #646cff 0%, #9c27b0 100%);
          color: white;
          border-radius: var(--radius);
          margin-bottom: 1rem;
        }
        .hero-section h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .hero-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        .search-container {
          display: flex;
          justify-content: center;
        }
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2rem;
        }
        .loading, .error, .no-results {
          text-align: center;
          font-size: 1.2rem;
          padding: 2rem;
          color: #666;
        }
        .error {
          color: #d32f2f;
        }
      `}</style>
        </div>
    );
};

export default Home;
