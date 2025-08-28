import Carta from "../componentes/portada";
import { fetchBooks } from "../../actions/server-actions";

export default async function SearchPage(props: { searchParams?: Record<string, string | string[]> }) {
  const searchParams = await props.searchParams;
  
  const query = (searchParams?.q ?? "").toString(); // seguro y string
  const libros = await fetchBooks(query);

  return (
    <main className="min-h-screen bg-[#F5F5F5] p-8">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#00ab3c" }}>
        Resultados para: {query}
      </h1>

      {libros.length === 0 ? (
        <p>No se encontraron libros.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {libros.map(libro => <Carta key={libro.id} libro={libro} />)}
        </div>
      )}
    </main>
  );
}
