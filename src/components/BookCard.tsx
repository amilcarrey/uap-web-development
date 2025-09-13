import Link from "next/link";
import { Book } from "@/types/book";
import { cleanDescription } from "../utils/cleanDescription";



export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-56 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="font-semibold text-lg">{book.title}</h3>
      <p className="text-gray-500 text-sm">{book.authors?.join(", ")}</p>

      {book.description && (
        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
          {cleanDescription(book.description)}
        </p>
      )}

      <Link
        href={`/book/${book.id}`}
        className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver detalles
      </Link>
    </div>
  );
}
