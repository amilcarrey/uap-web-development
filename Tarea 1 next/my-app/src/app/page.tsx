"use client";
import React, { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setBooks(data.items || []);
    setLoading(false);
  };
  return (
    <main>
      <h1>Biblioteca</h1>
      <form onSubmit={searchBooks}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar libro"
        />
        <button type="submit">Buscar</button>
      </form>
      {loading && <p>Cargando...</p>}
      <ul>
        {books.map((book: any) => (
          <li key={book.id}>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                style={{ width: 60, marginRight: 8, verticalAlign: "middle" }}
              />
            )}
            <div>
              <strong>{book.volumeInfo.title}</strong>
              {book.volumeInfo.authors && (
                <span> — {book.volumeInfo.authors.join(", ")}</span>
              )}
              <div>
                {book.volumeInfo.publishedDate && (
                  <span>Año: {book.volumeInfo.publishedDate}</span>
                )}
              </div>
              {book.volumeInfo.description && (
                <p>{book.volumeInfo.description.slice(0, 100)}...</p>
              )}
            </div>
            {book.volumeInfo.authors && (
              <span> — {book.volumeInfo.authors.join(", ")}</span>
            )}
          </li>
        ))}

      </ul>
    </main>
  );
}
