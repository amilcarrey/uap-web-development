"use client";

import { useState } from "react";

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newReview = { review, rating, votes: 0 };
    const existing = JSON.parse(localStorage.getItem(bookId) || "[]");
    localStorage.setItem(bookId, JSON.stringify([...existing, newReview]));
    setReview("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
      <textarea
        placeholder="Escribe tu reseña..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-2 border rounded">
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrellas</option>)}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Publicar Reseña
      </button>
    </form>
  );
}
