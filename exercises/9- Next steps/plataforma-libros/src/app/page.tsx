'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);

  return (
    <div>
      <h1 className="text-3xl mb-4">Busca Libros</h1>
      <SearchBar onSearch={setBooks} />
      <div>
        {books.length === 0 && <p>No hay resultados escribi mejor .</p>}
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}