import { searchBooks } from './actions/books';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import MainMenu from './components/MainMenu';
import ReviewsSection from './components/ReviewsSection';
import UserMenu from './components/UserMenu';
import Link from 'next/link';

async function getData(q: string | undefined) {
  const query = q?.trim() || '';
  if (!query) return [];
  return await searchBooks(query);
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const params = await searchParams;
  const results = await getData(params?.q);
  const hasResults = params?.q && results.length > 0;
  const currentView = params?.q ? 'search' : (params?.view || 'menu');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className={`bg-green-800 text-white transition-all duration-500 ${hasResults ? 'py-4' : 'py-16'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-light mb-8 tracking-wide">Libros y Review</h1>
          
          {/* Navigation */}
          <nav className="flex justify-center items-center gap-6 mb-8">
            <Link 
              href="/" 
              className={`px-6 py-2 rounded-full transition-all duration-300 font-light ${currentView === 'menu' ? 'bg-green-700 text-white shadow-lg' : 'text-green-100 hover:text-white hover:bg-green-700/50'}`}
            >
              Inicio
            </Link>
            <Link 
              href="/?view=search" 
              className={`px-6 py-2 rounded-full transition-all duration-300 font-light ${currentView === 'search' ? 'bg-green-700 text-white shadow-lg' : 'text-green-100 hover:text-white hover:bg-green-700/50'}`}
            >
              Buscar
            </Link>
            <Link 
              href="/?view=reviews" 
              className={`px-6 py-2 rounded-full transition-all duration-300 font-light ${currentView === 'reviews' ? 'bg-green-700 text-white shadow-lg' : 'text-green-100 hover:text-white hover:bg-green-700/50'}`}
            >
              Mis Reseñas
            </Link>
            {/* Menú de usuario */}
            <UserMenu />
          </nav>
          
          {/* Search Form */}
          {currentView === 'search' && (
            <form action="/?view=search" className="max-w-2xl mx-auto">
              <input
                type="text"
                name="q"
                defaultValue={params?.q || ''}
                placeholder="Busca por título, autor o ISBN..."
                className="w-full px-6 py-4 rounded-full text-green-800 text-lg bg-white/90 border-2 border-green-600 placeholder-green-600/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-lg"
              />
            </form>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'menu' && <MainMenu />}
        
        {currentView === 'search' && (
          <>
            {!params?.q ? (
              <div className="text-center text-green-700">
                <p className="text-xl font-light">Ingresa un término de búsqueda para comenzar</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-green-700">
                <p className="text-xl font-light">No se encontraron resultados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
        
        {currentView === 'reviews' && <ReviewsSection />}
      </main>
      
      <BookModal />
    </div>
  );
}
