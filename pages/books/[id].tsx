// pages/books/[id].tsx
import { GetServerSideProps } from "next";
import { getBookById } from "../../utils/googleBooks";
import { Book } from "../../types";
import Layout from "../../components/Layout";

interface Props {
  book: Book | null;
}

const BookPage: React.FC<Props> = ({ book }) => {
  if (!book) return <p>Libro no encontrado</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow">
        <img
          src={book.image}
          alt={book.title}
          className="w-48 h-64 object-cover mx-auto md:mx-0"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-2">{book.authors.join(", ")}</p>
          <p className="mb-4">{book.description}</p>
          <p className="text-sm text-gray-500">
            Publicado: {book.publishedDate} | Páginas: {book.pageCount} | Categorías:{" "}
            {book.categories.join(", ")}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const book = await getBookById(id as string);
  return { props: { book } };
};

export default BookPage;
