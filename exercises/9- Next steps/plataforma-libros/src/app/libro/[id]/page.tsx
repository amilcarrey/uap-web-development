import axios from 'axios';
import BookDetails from '@/components/BookDetails';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

async function getBook(id: string) {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
  return response.data;
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  return (
    <div>
      <BookDetails book={book} />
      <h2 className="text-2xl mt-8 mb-4">Reseñas</h2>
      <ReviewList bookId={params.id} />
      <ReviewForm bookId={params.id} />
    </div>
  );
}