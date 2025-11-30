import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for books..."
                className="search-input"
            />
            <button type="submit" className="search-button">
                Search
            </button>
            <style>{`
        .search-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 600px;
        }
        .search-input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: var(--radius);
          font-size: 1rem;
        }
        .search-button {
          padding: 10px 20px;
          background-color: var(--primary-color);
          color: white;
          border-radius: var(--radius);
          font-weight: 600;
          transition: background-color 0.2s;
        }
        .search-button:hover {
          background-color: var(--primary-hover);
        }
      `}</style>
        </form>
    );
};

export default SearchBar;
