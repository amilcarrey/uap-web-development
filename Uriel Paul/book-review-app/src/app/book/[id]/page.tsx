import { getBookById } from "../../lib/googleBooks";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book) return <p>No se encontró el libro.</p>;

  const info = book.volumeInfo;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex gap-6">
        <img
          src={info.imageLinks?.thumbnail || "/no-cover.png"}
          alt={info.title}
          className="w-48 h-auto"
        />
        <div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="text-gray-600">{info.authors?.join(", ")}</p>
          <p>{info.description}</p>
          <p className="text-sm mt-2 text-gray-500">
            {info.publishedDate} • {info.pageCount} páginas
          </p>
        </div>
      </div>

      {/* Reseñas */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
        <ReviewForm bookId={book.id} />
        <ReviewList bookId={book.id} />
      </section>
    </div>
  );
}
