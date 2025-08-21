"use client";

import { useState } from "react";
import { useAddReview } from "@/hooks/useReviews";

export default function ReviewForm({ bookId }: { bookId: string }) {
  const user = "Usuario1"; // simulado
  const addReviewMutation = useAddReview(bookId, user);

  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addReviewMutation.mutate({ text, rating });
    setText("");
    setRating(5);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mb-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu reseña..."
        className="w-full p-2 border rounded mb-2 text-gray-700"
      />
      <div className="flex items-center gap-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
