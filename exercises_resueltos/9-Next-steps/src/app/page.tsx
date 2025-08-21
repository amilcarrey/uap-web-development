import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import { Book } from '@/types';
import { searchBooks } from '@/utils/googleBooks';

export default async function Home() {
  // Fetch featured books on the server
  const featuredBooks: Book[] = await searchBooks('best sellers 2023').then(books => books.slice(0, 4));

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Descubre y Reseña tus Libros Favoritos</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra nuevos libros, lee reseñas de la comunidad y comparte tus opiniones.
          </p>
          <SearchBar/>
        </section>
      </main>
    </> 
  );
}