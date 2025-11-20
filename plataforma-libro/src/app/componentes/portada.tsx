import Link from 'next/link'
import { Libro } from '../tipos/libro'

const Carta = ({ libro }: { libro: Libro }) => {

  return (
    <Link href={`/book/${libro.id}`} passHref>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition"
        style={{ color: '#5e3929' }}
  >
        <img
          src={libro.imagen || "/images/default-book.jpg"}
          alt={libro.titulo}
          className="w-32 h-48 object-cover mb-4 rounded-md"
        />

        <h3 className="text-lg font-semibold mb-2 text-center">{libro.titulo}</h3>
        <p className="text-gray-600 text-sm mb-2 text-center">
          {libro.autor?.join(', ') || 'Autor desconocido'}
        </p>
      </div>
    </Link>
  );
};

export default Carta;
