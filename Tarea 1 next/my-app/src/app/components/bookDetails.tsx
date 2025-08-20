// src/app/components/BookDetails.tsx
"use client";
import { useEffect, useState } from "react";
import { addReview, getReviews, voteReview } from "../actions/reviewActions";

export default function BookDetails({ book }: { book: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchReviews() {
    const res = await getReviews(book.id);
    setReviews(res);
  }

  useEffect(() => {
    fetchReviews();
  }, [book.id]);

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("bookId", book.id);
    formData.append("rating", rating.toString());
    formData.append("text", text);
    await addReview(formData);
    setText("");
    setRating(5);
    await fetchReviews();
    setLoading(false);
  }

  async function handleVote(reviewId: string, delta: number) {
    setLoading(true);
    await voteReview(reviewId, delta);
    await fetchReviews();
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex gap-6 items-start mb-6">
        <img
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt="cover"
          className="w-32 h-48 object-cover rounded border shadow"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2  text-gray-900">{book.volumeInfo.title}</h2>
          <p className="text-gray-700 mb-1"><b>Autor:</b> {book.volumeInfo.authors?.join(', ')}</p>
          <p className="text-gray-700 mb-1"><b>Publicado:</b> {book.volumeInfo.publishedDate}</p>
          <p className="text-gray-600 text-sm mt-2">{book.volumeInfo.description}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Agregar Reseña</h3>
        <form onSubmit={handleAddReview} className="flex gap-2 mb-2">
          <input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} required className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <textarea value={text} onChange={e => setText(e.target.value)} required placeholder="Escribe tu reseña..." className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" rows={2} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>Agregar</button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Reseñas</h3>
        <ul className="space-y-4">
          {reviews.length === 0 && (
            <li className="text-gray-500">Aún no hay reseñas para este libro.</li>
          )}
          {reviews.map((r, i) => (
            <li key={r.id} className="bg-gray-50 rounded p-3 shadow flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 mb-1 sm:mb-0">
                <span className="font-bold text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="text-gray-700 ml-2">{r.text}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => handleVote(r.id, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  title="Votar positivo"
                  disabled={loading}
                >👍</button>
                <button
                  onClick={() => handleVote(r.id, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Votar negativo"
                  disabled={loading}
                >👎</button>
                <span className="text-gray-700">Votos: {r.votes}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}