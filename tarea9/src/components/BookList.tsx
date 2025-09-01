import React from "react";
import { Book } from "../hooks/useBooksSearch";

interface BookListProps {
  books: Book[];
  onSelect: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onSelect }) => {
  if (books.length === 0) {
    return <p className="text-gray-500">No se encontraron libros.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map(book => (
        <li key={book.id} className="border rounded p-4 flex flex-col items-center">
          {book.thumbnail && (
            <img src={book.thumbnail} alt={book.title} className="mb-2 w-24 h-36 object-cover" />
          )}
          <h3 className="font-bold text-lg mb-1 text-center">{book.title}</h3>
          <p className="text-sm text-gray-700 mb-2 text-center">
            {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido"}
          </p>
          <button
            className="mt-auto bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={() => onSelect(book)}
          >
            Ver detalles
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
