import { Book } from '@/types';

interface BookDetailsProps {
  book: Book;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {book.imageLinks?.thumbnail && (
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={book.imageLinks.thumbnail.replace('http:', 'https:')}
              alt={book.title}
              className="max-w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}
        <div className="md:w-2/3 p-6">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          
          {book.authors && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Autor(es)</h2>
              <p>{book.authors.join(', ')}</p>
            </div>
          )}
          
          {book.publishedDate && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Fecha de publicación</h2>
              <p>{new Date(book.publishedDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {book.pageCount && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Número de páginas</h2>
              <p>{book.pageCount}</p>
            </div>
          )}
          
          {book.categories && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Categorías</h2>
              <p>{book.categories.join(', ')}</p>
            </div>
          )}
          
          {book.averageRating && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Calificación promedio</h2>
              <div className="flex items-center">
                <div className="text-yellow-400 text-xl">
                  {'★'.repeat(Math.round(book.averageRating))}
                  {'☆'.repeat(5 - Math.round(book.averageRating))}
                </div>
                <span className="ml-2">
                  ({book.ratingsCount || 0} calificaciones)
                </span>
              </div>
            </div>
          )}
          
          {book.industryIdentifiers && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">ISBN</h2>
              {book.industryIdentifiers.map((identifier, index) => (
                <p key={index}>
                  {identifier.type}: {identifier.identifier}
                </p>
              ))}
            </div>
          )}
          
          {book.description && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Descripción</h2>
              <p className="whitespace-pre-line">
                {book.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;