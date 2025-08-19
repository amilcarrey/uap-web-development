'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, autor o ISBN..."
          className="flex-grow px-4 py-3 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;