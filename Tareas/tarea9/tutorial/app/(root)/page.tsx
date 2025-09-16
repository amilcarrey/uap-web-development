import Image from "next/image";
import SearchForm from "../components/SearchForm";

export default async function Home({searchParams}: {
  searchParams: Promise<{ query?: string; }>;
}){
  const query = (await searchParams).query;

  return (
    <>
    <section className="pink_container pattern">
      <h1 className="heading"> Busca Libros <br /> Escribe reseñas</h1>
      <p className="sub-heading !max-w-3xl">
        Encuentra y comparte reseñas de tus libros favoritos con nuestra comunidad.
      </p>
      <SearchForm query={query} />
    </section>

    </>
  );
}
