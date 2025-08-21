"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

interface Review {
  id: number;
  bookId: string;
  user: string;
  rating: number;
  comment: string;
  votes: number;
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Cargar datos del libro
  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      if (!res.ok) return notFound();
      const data = await res.json();
      setBook(data);
      setLoading(false);
    }
    fetchBook();
  }, [id]);

  // Cargar reseñas
  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.filter((r: Review) => r.bookId === id));
    }
    fetchReviews();
  }, [id]);

  // Agregar reseña
  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: id,
        user: "Anónimo",
        rating,
        comment,
      }),
    });
    const newReview = await res.json();
    setReviews([...reviews, newReview]);
    setRating(0);
    setComment("");
  }

  // Votar reseña
  async function handleVote(reviewId: number, vote: number) {
    await fetch("/api/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, vote }),
    });

    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, votes: r.votes + vote } : r
      )
    );
  }

  if (loading) return <p className="text-center">⏳ Cargando...</p>;
  if (!book) return notFound();

  const info = book.volumeInfo;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      {/* Datos del libro */}
      <div className="flex flex-col md:flex-row gap-6">
        {info.imageLinks?.thumbnail && (
          <img
            src={info.imageLinks.thumbnail}
            alt={info.title}
            className="w-48 h-72 object-cover rounded"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="text-gray-600 mt-1">
            {info.authors?.join(", ") || "Autor desconocido"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Publicado: {info.publishedDate || "Sin fecha"} —{" "}
            {info.publisher || "Editorial desconocida"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Páginas: {info.pageCount || "N/A"} | Categorías:{" "}
            {info.categories?.join(", ") || "N/A"}
          </p>
        </div>
      </div>

      {/* Descripción */}
      {info.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Descripción</h2>
          <p className="text-gray-700">{info.description}</p>
        </div>
      )}

      {/* Formulario reseña */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Escribir Reseña</h2>
        <form onSubmit={handleAddReview} className="space-y-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribí tu opinión..."
            className="w-full border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Publicar
          </button>
        </form>
      </div>

      {/* Lista de reseñas */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reseñas</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No hay reseñas todavía</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border rounded p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">{r.user}</p>
                  <p className="text-yellow-500">
                    {"★".repeat(r.rating)}{" "}
                    <span className="text-gray-400">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </p>
                </div>
                <p className="mt-2">{r.comment}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleVote(r.id, +1)}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleVote(r.id, -1)}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    👎
                  </button>
                  <span className="text-sm text-gray-500">
                    Votos: {r.votes}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
