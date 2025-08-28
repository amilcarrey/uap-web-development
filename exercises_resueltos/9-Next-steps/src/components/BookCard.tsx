'use client';

import Link from 'next/link';
import { Book } from '@/types';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/book/${book.id}`}>
        <div className="flex flex-col md:flex-row">
          {book.imageLinks?.thumbnail && !imageError ? (
            <div className="md:w-1/4">
              <img
                src={book.imageLinks.thumbnail.replace('http:', 'https:')}
                alt={book.title}
                className="w-full h-48 object-contain md:h-full"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="md:w-1/4 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          )}
          <div className="p-4 md:w-3/4">
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            {book.authors && (
              <p className="text-gray-600 mb-2">
                Por: {book.authors.join(', ')}
              </p>
            )}
            {book.publishedDate && (
              <p className="text-sm text-gray-500 mb-2">
                Publicado: {new Date(book.publishedDate).getFullYear()}
              </p>
            )}
            {book.averageRating && (
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(book.averageRating))}
                  {'☆'.repeat(5 - Math.round(book.averageRating))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({book.ratingsCount || 0} calificaciones)
                </span>
              </div>
            )}
            {book.description && (
              <p className="text-gray-700 line-clamp-3">
                {book.description.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;