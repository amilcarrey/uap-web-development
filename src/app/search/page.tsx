"use client";
import { Book, GoogleBooksResponse } from "@/types/book";
import BookCard from "@/components/BookCard";



async function getBooks(query: string): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data: GoogleBooksResponse = await res.json();

  return data.items?.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    description: item.volumeInfo.description,
    publishedDate: item.volumeInfo.publishedDate,
    pageCount: item.volumeInfo.pageCount,
    categories: item.volumeInfo.categories,
    thumbnail: item.volumeInfo.imageLinks?.thumbnail
  })) || [];
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const books = searchParams.q ? await getBooks(searchParams.q) : [];

  return (
    <div>
      <h2 className="text-xl mb-4">Resultados de: {searchParams.q}</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
