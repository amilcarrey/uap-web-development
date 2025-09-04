"use client";

import { useState } from "react";

export default function ReviewForm({
  bookId,
  onSubmitted,
}: {
  bookId: string;
  onSubmitted: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,   // 👈 aseguramos que siempre viaje
          author,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        console.error("Error al guardar reseña", await res.text());
        return;
      }

      setAuthor("");
      setRating(5);
      setComment("");

      onSubmitted(); // refresca la lista
    } catch (err) {
      console.error("Error en la petición:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Tu nombre"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="border p-2 w-full rounded"
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 w-full rounded"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} estrellas
          </option>
        ))}
      </select>
      <textarea
        placeholder="Escribe tu reseña..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
