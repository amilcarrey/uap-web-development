import Link from 'next/link';

export default function BookCard({ book }: { book: any }) {
  const { volumeInfo } = book;
  return (
    <div className="border p-4 mb-4 flex">
      <img
        src={volumeInfo.imageLinks?.thumbnail || '/placeholder.jpg'}
        alt={volumeInfo.title}
        className="w-24 h-36 mr-4"
      />
      <div>
        <h2 className="text-xl font-bold">{volumeInfo.title}</h2>
        <p>Autor: {volumeInfo.authors?.join(', ') || 'Desconocido'}</p>
        <Link href={`/libro/${book.id}`} className="text-blue-500">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}