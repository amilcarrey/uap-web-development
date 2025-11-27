import { Book } from "@/types/book";
import Link from "next/link";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/libros/${book.id}`}>
      <div className="flex flex-col items-center justify-between h-64 p-4 border border-gray-300">
        {/* Imagen del libro */}
        {book.volumeInfo.imageLinks?.thumbnail ? (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-32 h-40 object-cover rounded-lg"
          />
        ) : (
          <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            Sin imagen
          </div>
        )}

        {/* Nombre del libro */}
        <p className="text-center font-semibold text-sm mt-2">
          {book.volumeInfo.title}
        </p>
      </div>
    </Link>
  );
}
