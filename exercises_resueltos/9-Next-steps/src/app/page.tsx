import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import { Book } from '@/types';
import { searchBooks } from '@/utils/googleBooks';

export default async function Home() {
  // Fetch featured books on the server - CORREGIDO
  const featuredBooksResult = await searchBooks('best sellers 2023');
  const featuredBooks: Book[] = featuredBooksResult.books.slice(0, 4);

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Descubre y Reseña tus Libros Favoritos</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra nuevos libros, lee reseñas de la comunidad y comparte tus opiniones.
          </p>
          <SearchBar />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Libros Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Busca Libros</h3>
              <p className="text-gray-600">Encuentra libros por título, autor o ISBN usando la API de Google Books.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Lee Detalles</h3>
              <p className="text-gray-600">Visualiza información completa del libro, incluyendo descripción y portada.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Califica y Reseña</h3>
              <p className="text-gray-600">Comparte tus opiniones y vota por las reseñas más útiles de la comunidad.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}