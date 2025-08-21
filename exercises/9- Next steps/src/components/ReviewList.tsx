"use client";
import { useEffect, useState } from "react";
import { Review } from "@/types/review";

export default function ReviewList({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?bookId=${bookId}`);
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const handleVote = async (reviewId: string, type: "up" | "down") => {
    await fetch("/api/reviews", {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, voteType: type })
    });
    fetchReviews(); 
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-xl mb-3">Reseñas:</h3>
      {reviews.map(r => (
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
              onClick={() => handleVote(r.id, "up")}
              className="text-green-600 hover:text-green-800 font-semibold transition-colors"
            >
              👍 {r.votesUp}
            </button>
            <button
              onClick={() => handleVote(r.id, "down")}
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
