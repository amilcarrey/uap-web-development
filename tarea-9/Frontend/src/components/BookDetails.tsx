// src/components/BookDetails.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

type Book = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
  };
};

type Props = {
  id: string;
};

export default function BookDetails({ id }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err: any) {
        console.error("Error cargando libro:", err.message);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Cargando detalles del libro...</p>;

  return (
    <div style={{ border: "1px solid #aaa", padding: 16, marginTop: 16 }}>
      {book.volumeInfo.imageLinks?.thumbnail && (
        <img
          src={book.volumeInfo.imageLinks.thumbnail}
          alt={book.volumeInfo.title}
          style={{ float: "left", marginRight: 16, maxHeight: 200 }}
        />
      )}

      <h2>{book.volumeInfo.title}</h2>

      {book.volumeInfo.authors && (
        <p>
          <b>Autor/es:</b> {book.volumeInfo.authors.join(", ")}
        </p>
      )}

      {book.volumeInfo.publishedDate && (
        <p>
          <b>Publicado:</b> {book.volumeInfo.publishedDate}
        </p>
      )}

      {book.volumeInfo.pageCount && (
        <p>
          <b>Páginas:</b> {book.volumeInfo.pageCount}
        </p>
      )}

      {book.volumeInfo.categories && (
        <p>
          <b>Categorías:</b> {book.volumeInfo.categories.join(", ")}
        </p>
      )}

      {book.volumeInfo.description && (
        <div
          dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}
          style={{ clear: "both", marginTop: 8 }}
        />
      )}

      <hr style={{ margin: "16px 0" }} />

      {/* Formulario para agregar reseña */}
      <ReviewForm
        bookId={book.id}
        onSaved={() => setRefreshReviews((prev) => !prev)}
      />

      {/* Lista de reseñas */}
      <ReviewsList key={refreshReviews ? 1 : 0} bookId={book.id} />
    </div>
  );
}
