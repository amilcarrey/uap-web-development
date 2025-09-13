"use client";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";
import BookDetail from "../components/BookDetail";
import ReviewsSection from "../components/ReviewsSection";
import { useBooksSearch, Book } from "../hooks/useBooksSearch";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { books, loading, error } = useBooksSearch(query);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Buscador de Libros</h1>
      <SearchBar onSearch={setQuery} />
      {loading && <p className="text-blue-600">Buscando libros...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!selectedBook ? (
        <BookList books={books} onSelect={setSelectedBook} />
      ) : (
        <>
          <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} />
          <ReviewsSection bookId={selectedBook.id} />
        </>
      )}
    </div>
  );
}
