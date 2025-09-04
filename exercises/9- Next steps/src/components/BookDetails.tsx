"use client";

import { useState } from "react";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export default function BookDetails({ book }: { book: any }) {
  const [refreshToken, setRefreshToken] = useState(0);
  const bookId = book.id;
  console.log("Book ID:", bookId);


  if (!book) return <p>Libro no encontrado</p>;
  if (!bookId) return <p>ID del libro no encontrado</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-700 mb-4">{book.description}</p>

      <h2 className="text-2xl font-semibold mb-2">Reseñas</h2>
      <ReviewForm
        bookId={bookId}
        onSubmitted={() => setRefreshToken(prev => prev + 1)}
      />
      <ReviewList bookId={bookId} refreshToken={refreshToken} />
    </div>
  );
}
