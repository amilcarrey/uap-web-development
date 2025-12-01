import React, { useEffect } from "react";
import { useReviews } from "../hooks/useReviews";

export default function ReviewsList({ bookId }: { bookId: string }) {
  const { reviews, loading, fetchReviews, vote } = useReviews(bookId);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  if (loading) return <p>Cargando reseñas...</p>;
  if (reviews.length === 0) return <p>No hay reseñas</p>;

  return (
    <div>
      {reviews.map(r => (
        <div key={r.id} style={{ borderTop: "1px solid #eee", padding: 8 }}>
          <div><b>{r.userId}</b> • Rating: {r.rating} ⭐</div>
          <div dangerouslySetInnerHTML={{ __html: r.content ?? "" }} />
          <div>
            Score: {r.score} ({r.votesCount} votos)
            <button onClick={() => vote(r.id, 1)}>👍</button>
            <button onClick={() => vote(r.id, -1)}>👎</button>
          </div>
        </div>
      ))}
    </div>
  );
}
