/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { searchBooks } from "@/lib/googleBooks";

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const books = searchParams.q ? await searchBooks(searchParams.q) : null;

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">📚 Reseñas de Libros</h1>
      <SearchBar />
      {books && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.items?.map((book: any) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </main>
  );
}
