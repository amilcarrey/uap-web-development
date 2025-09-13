import React, { useState } from "react";

interface Review {
  id: number;
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
}

interface ReviewsSectionProps {
  bookId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ bookId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || rating < 1) return;
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        text,
        rating,
        likes: 0,
        dislikes: 0,
      },
    ]);
    setText("");
    setRating(0);
  };

  const handleVote = (id: number, type: "like" | "dislike") => {
    setReviews(reviews =>
      reviews.map(r =>
        r.id === id
          ? {
              ...r,
              likes: type === "like" ? r.likes + 1 : r.likes,
              dislikes: type === "dislike" ? r.dislikes + 1 : r.dislikes,
            }
          : r
      )
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reseñas</h3>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe tu reseña..."
          className="border rounded px-3 py-2 resize-none"
          rows={3}
        />
        <div className="flex items-center gap-2">
          <span>Calificación:</span>
          {[1,2,3,4,5].map(star => (
            <button
              type="button"
              key={star}
              className={star <= rating ? "text-yellow-400" : "text-gray-400"}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 self-start"
        >
          Enviar reseña
        </button>
      </form>
      <ul className="space-y-4">
        {reviews.length === 0 && <li className="text-gray-500">Aún no hay reseñas.</li>}
        {reviews.map(r => (
          <li key={r.id} className="border rounded p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              {[1,2,3,4,5].map(star => (
                <span key={star} className={star <= r.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div>
            <p className="mb-2 text-gray-900">{r.text}</p>
            <div className="flex gap-4">
              <button
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                onClick={() => handleVote(r.id, "like")}
              >
                👍 {r.likes}
              </button>
              <button
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                onClick={() => handleVote(r.id, "dislike")}
              >
                👎 {r.dislikes}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsSection;
