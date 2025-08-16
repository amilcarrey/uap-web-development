import Image from 'next/image';
import Link from 'next/link';
import { Book } from '../types/index';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { volumeInfo } = book;
  const coverImage = volumeInfo.imageLinks?.thumbnail || '/next.svg';
  
  return (
    <Link href={`/book/${book.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={coverImage}
              alt={volumeInfo.title}
              width={80}
              height={120}
              className="rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {volumeInfo.title}
            </h3>
            {volumeInfo.authors && (
              <p className="text-gray-600 text-sm mt-1">
                {volumeInfo.authors.join(', ')}
              </p>
            )}
            {volumeInfo.averageRating && (
              <div className="mt-2">
                <StarRating rating={volumeInfo.averageRating} readonly />
                <span className="text-sm text-gray-500 ml-2">
                  ({volumeInfo.ratingsCount || 0} reseñas)
                </span>
              </div>
            )}
            {volumeInfo.description && (
              <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                {volumeInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 