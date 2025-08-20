import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar libros (usado por input y botón)
  const buscarLibros = async (valor: string) => {
    if (valor.trim().length > 2) {
      setLoading(true);
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(valor)}`);
      const data = await res.json();
      setBooks(data.items || []);
      setLoading(false);
    } else {
      setBooks([]);
      setLoading(false);
    }
  };

  // Sugerencias en tiempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    buscarLibros(value);
  };

  // Buscar al apretar el botón
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buscarLibros(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        {/* Formulario con input y botón */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Buscar libros..."
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        {loading && (
          <p className="text-gray-500">Cargando...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book: any) => {
            const info = book.volumeInfo;
            return (
              <Link href={`/books/${book.id}`} key={book.id}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition cursor-pointer">
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
              </Link>
            );
          })}
        </div>  
      </main>

      <Footer />
    </div>
  );
}