"use client";
import { useEffect, useState } from "react";
import { Review } from "../types/review";

type Props = {
  bookId: string;
  refreshToken?: number; // para re-fetch al enviar reseña
};

export default function ReviewList({ bookId, refreshToken = 0 }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?bookId=${encodeURIComponent(bookId)}&t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Error al obtener reseñas");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, refreshToken]);

  if (loading) return <p className="mt-2 text-gray-500">Cargando reseñas…</p>;

  return (
    <div className="mt-6">
      <h3 className="font-bold text-xl mb-3">Reseñas:</h3>
      {reviews.length === 0 && (
        <p className="text-gray-600">Aún no hay reseñas para este libro.</p>
      )}
      {reviews.map((r) => (
        <div key={r.id} className="border-l-4 border-blue-500 bg-white p-3 rounded shadow mb-3">
          <p className="font-semibold flex items-center gap-2">
            {r.author} -
            <span className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`text-lg ${n <= r.rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </span>
          </p>

          <p className="mt-1 text-gray-700">{r.comment}</p>

          <div className="flex gap-4 mt-2">
            <button
              onClick={async () => {
                await fetch("/api/reviews", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reviewId: r.id, voteType: "up" }),
                });
                fetchReviews();
              }}
              className="text-green-600 hover:text-green-800 font-semibold transition-colors"
            >
              👍 {r.votesUp}
            </button>
            <button
              onClick={async () => {
                await fetch("/api/reviews", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reviewId: r.id, voteType: "down" }),
                });
                fetchReviews();
              }}
              className="text-red-600 hover:text-red-800 font-semibold transition-colors"
            >
              👎 {r.votesDown}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
