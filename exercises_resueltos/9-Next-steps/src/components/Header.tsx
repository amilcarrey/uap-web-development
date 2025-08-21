import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            BookReviews
          </Link>
          <nav>
            <Link href="/search" className="px-3 py-2 hover:bg-blue-700 rounded">
              Buscar Libros
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;