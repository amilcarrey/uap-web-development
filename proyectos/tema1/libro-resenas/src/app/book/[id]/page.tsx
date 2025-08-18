"use client";
import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { guardarResena } from "./serverActionGuardarReseña";
import { notFound } from "next/navigation";

interface BookPageProps {
  params: { id: string };
}

export default function BookPage({ params }: BookPageProps) {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  type Resena = { review: string; rating: string; votes: number };
  const [resenas, setResenas] = useState<Resena[]>([]);
  const formAction = async (formData: FormData) => {
    const nuevaResena = await guardarResena(formData);
    setResenas([...resenas, { ...nuevaResena, votes: 0 }]);
  };

  const votar = (index: number, delta: number) => {
    setResenas(resenas =>
      resenas.map((r, i) =>
        i === index ? { ...r, votes: r.votes + delta } : r
      )
    );
  };

  if (loading) return <div>Cargando...</div>;
  if (!book) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{book.volumeInfo.title}</h1>
      <p className="mb-2">{book.volumeInfo.authors?.join(", ")}</p>
      {book.volumeInfo.imageLinks?.thumbnail && (
        <img
          src={book.volumeInfo.imageLinks.thumbnail}
          alt={book.volumeInfo.title}
          className="mb-4"
        />
      )}
      <p>{book.volumeInfo.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        Publicado: {book.volumeInfo.publishedDate} | Páginas:{" "}
        {book.volumeInfo.pageCount}
      </p>
  <form action={async (formData) => { await formAction(formData); }}>
        <label>
          Calificación:
          <select name="rating" required>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
        </label>
        <br />
        <label>
          Reseña:
          <textarea name="review" required />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
      <h4>Reseñas:</h4>
      <ul>
        {resenas.map((r, i) => (
          <li key={i}>
            {r.rating} ⭐ - {r.review}
            <button type="button" onClick={() => votar(i, 1)} style={{ marginLeft: 8 }}>👍</button>
            <button type="button" onClick={() => votar(i, -1)} style={{ marginLeft: 4 }}>👎</button>
            <span style={{ marginLeft: 8 }}>Votos: {r.votes}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}