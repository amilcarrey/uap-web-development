"use client";

import { useReviews, useVoteReview } from "@/hooks/useReviews";

export default function ReviewList({ bookId }: { bookId: string }) {
  const user = "Usuario1"; // simulado
  const { data: reviews, isLoading } = useReviews(bookId);
  const voteMutation = useVoteReview(bookId, user);

  if (isLoading) return <p>Cargando reseñas...</p>;
  if (!reviews?.length)
    return <p className="text-gray-500">Aún no hay reseñas.</p>;

  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="p-4 bg-white shadow rounded border">
          <p className="text-gray-800 mb-2">{r.text}</p>
          <p className="text-sm text-gray-500 mb-2">
            ⭐ {r.rating} | Por {r.user}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-700">Votos: {r.votes}</span>
            <button
              onClick={() => voteMutation.mutate({ reviewId: r.id, vote: 1 })}
              disabled={!!r.userVotes?.[user]} // ✅ convierte número a true/false
              className="px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50"
            >
              👍
            </button>

            <button
              onClick={() => voteMutation.mutate({ reviewId: r.id, vote: -1 })}
              disabled={!!r.userVotes?.[user]}
              className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
            >
              👎
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
