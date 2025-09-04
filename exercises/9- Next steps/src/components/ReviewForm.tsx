"use client";
import { useState } from "react";

type Props = {
  bookId: string;
  onSubmitted?: () => void;
};

export default function ReviewForm({ bookId, onSubmitted }: Props) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, author, rating, comment }),
      });
      if (!res.ok) throw new Error("No se pudo enviar la reseña");

      // limpiar y avisar
      setAuthor("");
      setRating(5);
      setComment("");
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar la reseña");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
      <input
        type="text"
        placeholder="Tu nombre"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={`text-3xl transition-colors ${
              (hover || rating) >= n ? "text-yellow-400" : "text-gray-300"
            }`}
            aria-label={`Calificación ${n}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Escribe tu reseña"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />

      <button
        type="submit"
        disabled={sending}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white p-2 rounded font-medium transition-colors"
      >
        {sending ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
