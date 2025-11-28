'use client'

import { SimpleBook } from '../lib/book-utils';

export default function BookCard({ book }: { book: SimpleBook }) {
  const handleMoreInfo = () => {
    const event = new CustomEvent('openBookModal', { detail: book.id });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-white border border-green-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:border-green-300">
      {book.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.thumbnail} alt={book.title} className="w-full h-64 object-cover" />
      ) : (
        <div className="w-full h-64 bg-green-100 flex items-center justify-center">
          <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-green-900 text-lg mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-green-700 text-sm mb-4 line-clamp-1">
          {book.authors?.join(', ') || 'Autor desconocido'}
        </p>
        <button 
          onClick={handleMoreInfo}
          className="w-full bg-green-900 text-white py-2 px-4 rounded hover:bg-green-800 transition-colors"
        >
          Más Info
        </button>
      </div>
    </div>
  );
}
