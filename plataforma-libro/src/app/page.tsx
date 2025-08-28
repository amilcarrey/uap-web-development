import { fetchBooks } from "../actions/server-actions"; //accion que consulta los libros
import Carta from "../app/componentes/portada";

export const metadata = {
  title: "Biblioteca Justito",
  };


export default async function Principal(props: { searchParams?: Record<string, string | string[]> }) {

  const searchParams = await props.searchParams;
  const query = (searchParams?.q ?? "").toString(); // ahora seguro
  const libros = await fetchBooks(query); // llamo a la accion del servidor para obtener los libros

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center py-8">
      <div className="header text-center px-4 md:px-12">
        {/* Título principal */}
        <div className="row1 mt-4 text-center">
          <h1
            className="text-4xl font-bold mb-6 inline-block bg-white/70 px-6 py-4 rounded-lg shadow-md"
            style={{ color: "#5e3929" }}
          >
            Bienvenido a la biblioteca virtual Justito
            <br />
            porque te ofrecemos lo justo para leer
          </h1>
        </div>

        {/* Buscador */}
        <div className="row2 mb-8">
          <h2 className="text-2xl mb-4" style={{ color: "#5e3929" }}>
            Encuentra tu libro
          </h2>
          <div className="search flex justify-center items-center gap-4">
          {/* antes aca iba El input de búsqueda, ahora ya no */}
            <form action="/search" method="get">
              <input
                type="text"
                name="q"
                placeholder="Ingresa el nombre del libro"
                className="px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2"
                style={{
                  border: "2px solid #cd8c52",
                  borderRadius: "0.375rem",
                  color: "#000",
                }}
              />
              <button
                type="submit"
                style={{ backgroundColor: "#cd8c52", color: "#171717" }}
                className="px-4 py-2 rounded-md font-semibold shadow-md"
              >
                Buscar
              </button>
            </form>  
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libros.map(libro => <Carta key={libro.id} libro={libro} />)}
      </div>
    </main>
  );
};
