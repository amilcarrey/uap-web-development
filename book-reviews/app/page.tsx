"use client";
import React, { useState, useEffect } from "react";

type Reseña = {
  id: string;
  libroId: string;
  usuario: string;
  calificacion: number;
  comentario: string;
  votos: number;
};

//Información del libro Google Books
type Libro = any;

// Barra de búsqueda de libros
const Buscador = ({ onBuscar }: { onBuscar: (q: string) => void }) => {
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Buscando:", q); // debug
        onBuscar(q);
      }}
      className="flex gap-3 mb-6"
    >
      <input
        type="text"
        placeholder="Buscar libro..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-xl text-black bg-white"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
};

//Información de los libro y agregar reseñas
const TarjetaLibro = ({ libro }: { libro: Libro }) => {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [usuario, setUsuario] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);

  useEffect(() => {
    const guardadas = localStorage.getItem(`reseñas-${libro.id}`);
    if (guardadas) setReseñas(JSON.parse(guardadas));
  }, [libro.id]);

  const guardar = (arr: Reseña[]) => {
    setReseñas(arr);
    localStorage.setItem(`reseñas-${libro.id}`, JSON.stringify(arr));
  };

  const agregar = () => {
    if (!usuario || !comentario) return;
    const nueva: Reseña = {
      id: Date.now().toString(),
      libroId: libro.id,
      usuario,
      calificacion,
      comentario,
      votos: 0,
    };
    guardar([...reseñas, nueva]);
    setUsuario("");
    setComentario("");
  };

  const votar = (id: string, delta: number) => {
    const arr = reseñas.map((r) =>
      r.id === id ? { ...r, votos: r.votos + delta } : r
    );
    guardar(arr);
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="text-lg font-bold text-blue-700">
        {libro.volumeInfo.title}
      </h3>

      {libro.volumeInfo.imageLinks?.thumbnail && (
        <img
          src={libro.volumeInfo.imageLinks.thumbnail}
          alt={libro.volumeInfo.title}
          className="my-2 rounded"
        />
      )}

      {/* Autor en negro */}
      <p className="text-black">
        <b>Autor:</b>{" "}
        {libro.volumeInfo.authors?.join(", ") || "Desconocido"}
      </p>

      {/* Descripción más legible */}
      <p className="text-gray-800 text-sm mt-1">
        {libro.volumeInfo.description
          ? libro.volumeInfo.description.slice(0, 150) + "..."
          : "Sin descripción"}
      </p>

      <div className="mt-3 space-y-2">
        {reseñas.length === 0 && (
          <p className="text-gray-500 italic">No hay reseñas</p>
        )}
        {reseñas.map((r) => (
          <div key={r.id} className="border p-2 rounded bg-gray-50">
            <p className="font-medium text-blue-600">
              {r.usuario} — {r.calificacion} ⭐
            </p>
            {/* Comentario en negro */}
            <p className="text-black">{r.comentario}</p>
            <div className="flex gap-2 text-sm mt-1">
              <button
                onClick={() => votar(r.id, +1)}
                className="text-green-600"
              >
                👍
              </button>
              <button
                onClick={() => votar(r.id, -1)}
                className="text-red-600"
              >
                👎
              </button>
              <span>{r.votos} votos</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        <input
          type="text"
          placeholder="Tu nombre"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full px-2 py-1 border rounded text-black"
        />
        <textarea
          placeholder="Escribe tu reseña"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full px-2 py-1 border rounded text-black"
        />
        <div className="flex gap-2 items-center">
          <select
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            className="px-2 py-1 border rounded text-black"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>
          <button
            onClick={agregar}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
//Página principal
export default function Page() {
  const [libros, setLibros] = useState<Libro[]>([]);

  const buscar = async (q: string) => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}`
    );
    const data = await res.json();
    console.log("Resultados:", data.items); // debug
    setLibros(data.items || []);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
        App de Reseñas de Libros
      </h1>
      <div className="max-w-2xl mx-auto">
        <Buscador onBuscar={buscar} />
        <div className="grid gap-5">
          {libros.map((libro) => (
            <TarjetaLibro key={libro.id} libro={libro} />
          ))}
        </div>
      </div>
    </main>
  );
}
