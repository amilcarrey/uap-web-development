import { Book } from '@/types'

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  selectedBookId?: string;
}

export default function BookList({ books, onBookSelect, selectedBookId }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay libros para mostrar</h3>
        <p className="text-gray-500">Utiliza el buscador para encontrar libros.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resultados de la búsqueda</h2>
      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => onBookSelect(book)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedBookId === book.id
                ? 'border-gray-500 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-4">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded shadow-md"
                />
              ) : (
                <div className="w-16 h-24 bg-gray-200 rounded shadow-md flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">{book.authors.join(', ')}</p>
                {book.publishedDate && (
                  <p className="text-sm text-gray-500">
                    Publicado: {new Date(book.publishedDate).getFullYear()}
                  </p>
                )}
                {book.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {book.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}