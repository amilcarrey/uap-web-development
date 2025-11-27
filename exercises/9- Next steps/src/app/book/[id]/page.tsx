// src/app/book/[id]/page.tsx
import React from "react";
import { Book, GoogleBooksItem } from "@/types/book";
import { cleanDescription } from "@/utils/cleanDescription";
import ReviewsSection from "@/components/ReviewsSection";

async function getBook(id: string): Promise<Book | null> {
  const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data: GoogleBooksItem = await res.json();
  if (!data) return null;

  return {
    id: data.id,
    title: data.volumeInfo.title,
    authors: data.volumeInfo.authors,
    description: data.volumeInfo.description,
    publishedDate: data.volumeInfo.publishedDate,
    pageCount: data.volumeInfo.pageCount,
    categories: data.volumeInfo.categories,
    thumbnail: data.volumeInfo.imageLinks?.thumbnail,
  };
}

// Este es un componente servidor
export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) return <p>Libro no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-96 object-cover rounded-md mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
      {book.authors && <p className="text-gray-600 mb-2">Autor(es): {book.authors.join(", ")}</p>}
      {book.publishedDate && <p className="text-gray-600 mb-1">Publicado: {book.publishedDate}</p>}
      {book.pageCount && <p className="text-gray-600 mb-1">Páginas: {book.pageCount}</p>}
      {book.categories && <p className="text-gray-600 mb-2">Categorías: {book.categories.join(", ")}</p>}
      {book.description && <p className="text-gray-700 mt-4">{cleanDescription(book.description)}</p>}

      {/* Client Component */}
      <ReviewsSection bookId={book.id} />
    </div>
  );
}
