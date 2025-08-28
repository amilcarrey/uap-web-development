import { notFound } from "next/navigation";
import ReseñaComponente from "../../componentes/reseña";

async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function BookPage(props: { params: { id: string } }) {
  // await props.params antes de usarlo
  const params = await props.params;
  const id = params.id.toString();

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
          src={info.imageLinks?.thumbnail}
          alt={info.title}
          className="w-auto h-auto max-w-[120px] max-h-[180px]"
        />
      ) : (
        <div className="w-48 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Sin portada
        </div>
      )}

      {/* Descripción */}
      <p className="mt-4">{info.description || "Sin descripción disponible."}</p>

      {/* Detalles */}
      <ul className="mt-4 text-sm text-white">
        <li><span className="text-[#fcf7d3]">Fecha de publicación:</span> {info.publishedDate || "N/A"}</li>
        <li><span className="text-[#fcf7d3]">Número de páginas:</span> {info.pageCount || "N/A"}</li>
        <li><span className="text-[#fcf7d3]">Categorías:</span> {info.categories?.join(", ") || "N/A"}</li>
      </ul>

      {/* Reseñas propias */}
      <div className="mt-8">
        <ReseñaComponente libroId={id} />
      </div>
    </main>
  );
}
