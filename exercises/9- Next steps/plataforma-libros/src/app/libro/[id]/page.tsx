import axios from 'axios';
import BookDetails from '@/components/BookDetails';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

async function getBook(id: string) {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
  console.log('Datos del libro:', response.data); // Imprimir datos para depuración
  return response.data;
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <div>
      <BookDetails book={book} />
      <h2 className="text-2xl mt-8 mb-4">Reseñas</h2>
      <ReviewList bookId={id} />
      <ReviewForm bookId={id} />
    </div>
  );
}