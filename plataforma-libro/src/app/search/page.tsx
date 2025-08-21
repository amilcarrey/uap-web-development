"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Carta from "../componentes/portada";
import { Libro } from "../tipos/libro";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
        );

      const mapped = res.data.items.map((item: any) => {
  const links = item.volumeInfo.imageLinks || {};
  return {
    id: item.id,
    titulo: item.volumeInfo.title,
    autor: item.volumeInfo.authors || ["Autor desconocido"],
    descripcion: item.volumeInfo.description,
    imagen: links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail || "",
    fechaPublicacion: item.volumeInfo.publishedDate,
    numPaginas: item.volumeInfo.pageCount,
    categorias: item.volumeInfo.categories || [],
  };
});

        setLibros(mapped);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <main className="min-h-screen bg-[#F5F5F5] p-8">
      <h1 className="text-3xl font-bold mb-4">
        Resultados para: {query}
      </h1>

      {loading && <p>Cargando...</p>}
      {!loading && libros.length === 0 && <p>No se encontraron libros.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libros.map((libro) => (
          <Carta key={libro.id} libro={libro} />
        ))}
      </div>
    </main>
  );
};

export default SearchPage;
