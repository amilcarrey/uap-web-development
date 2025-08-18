'use client';
import { useActionState } from "react";
import { buscarLibros } from "./lib/buscarLibro";
import Link from "next/link";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export default function Page() {
  const [libros, formAction] = useActionState<GoogleBook[], FormData>(buscarLibros, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="justify-center items-center text-center">
        <h1 className="text-2xl font-bold">Buscador de libros</h1>
        <form action={formAction}>
          <input name="query" type="text" placeholder="Buscar por título, autor o ISBN" />
          <button type="submit">Buscar</button>
        </form>
      </div>
      <div>
        <ul>
          {libros.map((libro) => (
            <li key={libro.id}>
              <h2>{libro.volumeInfo.title}</h2>
              <p>{libro.volumeInfo.description}</p>
              {libro.volumeInfo.imageLinks?.thumbnail && (
                <>
                  <img src={libro.volumeInfo.imageLinks.thumbnail} alt={libro.volumeInfo.title} />
                  <Link href={`/book/${libro.id}`}>Ir a libro</Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
