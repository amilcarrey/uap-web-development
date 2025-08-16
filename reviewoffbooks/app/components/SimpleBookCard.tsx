import { Book } from '../types/index';

interface SimpleBookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export default function SimpleBookCard({ book, onClick }: SimpleBookCardProps) {
  const { volumeInfo } = book;
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-black transition-colors cursor-pointer group"
      onClick={() => onClick(book)}
    >
      <h3 className="font-medium text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
        {volumeInfo.title}
      </h3>
      {volumeInfo.authors && (
        <p className="text-gray-600 text-sm mb-3">
          {volumeInfo.authors.join(', ')}
        </p>
      )}
      {volumeInfo.description && (
        <p className="text-gray-500 text-sm leading-relaxed">
          {volumeInfo.description.substring(0, 120)}...
        </p>
      )}
    </div>
  );
}
