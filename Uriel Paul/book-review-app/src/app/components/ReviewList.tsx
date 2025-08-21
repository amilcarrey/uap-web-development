"use client";

import { useEffect, useState } from "react";

interface Review {
  review: string;
  rating: number;
  votes: number;
}

export default function ReviewList({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(bookId) || "[]");
    setReviews(data);
  }, [bookId]);

  function vote(index: number, delta: number) {
    const updated = [...reviews];
    updated[index].votes += delta;
    setReviews(updated);
    localStorage.setItem(bookId, JSON.stringify(updated));
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r, i) => (
        <div key={i} className="border p-3 rounded shadow">
          <p className="font-semibold">{r.rating} ⭐</p>
          <p>{r.review}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => vote(i, 1)} className="px-2 py-1 bg-green-500 text-white rounded">👍</button>
            <button onClick={() => vote(i, -1)} className="px-2 py-1 bg-red-500 text-white rounded">👎</button>
            <span>{r.votes} votos</span>
          </div>
        </div>
      ))}
    </div>
  );
}
