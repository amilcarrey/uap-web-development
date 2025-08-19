import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data.items || []);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={searchBooks} className="flex mb-6">
          <input
            type="text"
            placeholder="Buscar libros..."
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-md"
          >
            Buscar
          </button>
        </form>

        {books.length === 0 && query && (
          <p className="text-gray-500">Cargando...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book: any) => {
            const info = book.volumeInfo;
            return (
              <div key={book.id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition">
                <img
                  src={info.imageLinks?.thumbnail || '/no-cover.png'}
                  alt={info.title}
                  className="w-full h-48 object-contain bg-gray-100"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{info.title}</h3>
                  <p className="text-xs text-gray-600">{info.authors?.join(', ')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
