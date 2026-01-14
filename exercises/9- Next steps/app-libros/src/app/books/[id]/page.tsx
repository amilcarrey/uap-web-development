import { fetchBookDetails } from "@/services/booksService";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await fetchBookDetails(id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-48 md:w-64 rounded shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            {book.volumeInfo.title}
          </h1>
          <p className="text-gray-600 mb-2">
            {book.volumeInfo.authors?.join(", ")}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {book.volumeInfo.publisher} • {book.volumeInfo.publishedDate}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {book.volumeInfo.description || "Sin descripción"}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Reseñas
        </h2>
        <ReviewForm bookId={id} />
        <ReviewList bookId={id} />
      </div>
    </div>
  );
}
