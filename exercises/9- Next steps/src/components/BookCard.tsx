import Link from "next/link";
import { Book } from "../types/book";
import { cleanDescription } from "../utils/cleanDescription";

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded-lg">
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-96 object-cover rounded-md mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      {book.authors && <p className="text-gray-600 mb-2">Autor(es): {book.authors.join(", ")}</p>}
      {book.publishedDate && <p className="text-gray-600 mb-2">Publicado: {book.publishedDate}</p>}
      {book.pageCount && <p className="text-gray-600 mb-2">Páginas: {book.pageCount}</p>}
      {book.categories && <p className="text-gray-600 mb-2">Categorías: {book.categories.join(", ")}</p>}

      {book.description && (
        <p className="text-gray-700 mt-4">{cleanDescription(book.description)}</p>
      )}
    </div>
  );
}
