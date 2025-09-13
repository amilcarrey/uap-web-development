import React from "react";
import { Book } from "../hooks/useBooksSearch";

interface BookDetailProps {
  book: Book | null;
  onBack?: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  if (!book) return null;

  return (
    <div className="border rounded p-6 max-w-xl mx-auto bg-white shadow">
      {book.thumbnail && (
        <img src={book.thumbnail} alt={book.title} className="mb-4 w-32 h-48 object-cover mx-auto" />
      )}
      <h2 className="text-2xl font-bold mb-2 text-center">{book.title}</h2>
      <p className="text-center text-gray-700 mb-2">
        {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido"}
      </p>
      <p className="text-center text-gray-500 mb-2">
        {book.publishedDate ? `Publicado: ${book.publishedDate}` : "Fecha desconocida"}
      </p>
      <p className="mb-4 text-justify text-gray-800">
        {book.description || "Sin descripción disponible."}
      </p>
      {onBack && (
        <button
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onBack}
        >
          Volver
        </button>
      )}
    </div>
  );
};

export default BookDetail;
