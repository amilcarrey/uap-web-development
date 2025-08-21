import { notFound } from "next/navigation";
import ReseñaComponente from "../../componentes/reseña";

async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

const BookPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // 👈 hay que await
  const book = await getBook(id);
  if (!book) return notFound();

  const info = book.volumeInfo;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{info.title}</h1>
      <p className="text-lg">{info.authors?.join(", ")}</p>

      {/* Portada grande */}
      {info.imageLinks?.large || info.imageLinks?.thumbnail ? (
        <img
           src={book.volumeInfo.imageLinks?.thumbnail}
            alt={book.volumeInfo.title}
            className="w-auto h-auto max-w-[120px] max-h-[180px]"
        />
      ) : (
        <div className="w-48 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Sin portada
        </div>
      )}

      {/* Descripción */}
      <p className="mt-4">{info.description || "Sin descripción disponible."}</p>

      {/* Extras */}
      <ul className="mt-4 text-sm text-gray-700">
        <li><strong>Fecha de publicación:</strong> {info.publishedDate || "N/A"}</li>
        <li><strong>Número de páginas:</strong> {info.pageCount || "N/A"}</li>
        <li><strong>Categorías:</strong> {info.categories?.join(", ") || "N/A"}</li>
      </ul>

      {/* Reseñas propias (tu sistema local, no Google) */}
      <div className="mt-8">
        <ReseñaComponente libroId={id} />
      </div>
    </main>
  );
};

export default BookPage;
