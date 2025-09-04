// app/search/page.tsx
import React from "react";
import Link from "next/link";
import { Book, GoogleBooksResponse } from "@/types/book";
import BookCard from "@/components/BookCard";

export async function getBooks(query: string): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data: GoogleBooksResponse = await res.json();

  return (
    data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    })) || []
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams; // ✅ uso correcto
  const books: Book[] = q ? await getBooks(q) : [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Resultados de: {q || "ninguna búsqueda"}</h2>

      {books.length === 0 ? (
        <p>No se encontraron libros.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              {/* Tarjeta del libro con hover */}
              <div className="hover:scale-[1.02] transition-transform duration-200">
                <BookCard book={book} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
