import { Book, GoogleBooksItem } from "@/types/book";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { cleanDescription } from "@/utils/cleanDescription";

async function getBook(id: string): Promise<Book | null> {
  const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const res = await fetch(url);
  const data: GoogleBooksItem = await res.json();
  if (!data) return null;

  return {
    id: data.id,
    title: data.volumeInfo.title,
    authors: data.volumeInfo.authors,
    description: data.volumeInfo.description,
    publishedDate: data.volumeInfo.publishedDate,
    pageCount: data.volumeInfo.pageCount,
    categories: data.volumeInfo.categories,
    thumbnail: data.volumeInfo.imageLinks?.thumbnail
  };
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params; 
  const book = await getBook(id);
  if (!book) return <p>No se encontró el libro</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
      <h1 className="text-2xl font-bold mt-2">{book.title}</h1>
      <p className="text-gray-600">{book.authors?.join(", ")}</p>
      <p className="mt-4">{cleanDescription(book.description)}</p>

      <ReviewForm bookId={book.id} />
      <ReviewList bookId={book.id} />
    </div>
  );
}
