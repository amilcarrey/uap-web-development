"use client";

import { useState } from "react";
import { searchBooks, GoogleBook } from "./lib/googleBooks";
import BookCard from "./components/BookCard";
import SearchBar from "./components/SearchBar";

export default function HomePage() {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    setLoading(true);
    const results = await searchBooks(query);
    setBooks(results);
    setLoading(false);
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Book Review App</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Cargando...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
}
