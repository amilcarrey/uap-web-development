"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Reseña = {
  id: string;
  libroId: string;
  usuario: string;
  calificacion: number;
  comentario: string;
  votos: number;
};

type Libro = any;

const Buscador = ({ onBuscar }: { onBuscar: (q: string) => void }) => {
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onBuscar(q);
      }}
      aria-label="Buscar libro"
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

const TarjetaLibro = ({ libro, isLoggedIn }: { libro: Libro; isLoggedIn: boolean }) => {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [usuario, setUsuario] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [esFavorito, setEsFavorito] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const favoritosKey = `favoritos-${token}`;

  useEffect(() => {
    const guardadas = localStorage.getItem(`reseñas-${libro.id}`);
    if (guardadas) setReseñas(JSON.parse(guardadas));

    if (isLoggedIn && token) {
      const favs = JSON.parse(localStorage.getItem(favoritosKey) || "[]");
      setEsFavorito(favs.includes(libro.id));
    }
  }, [libro.id, isLoggedIn, token]);

  const guardar = (arr: Reseña[]) => {
    setReseñas(arr);
    localStorage.setItem(`reseñas-${libro.id}`, JSON.stringify(arr));
  };

  const agregarOEditar = () => {
    if (!usuario || !comentario) return;

    if (editId) {
      const arr = reseñas.map((r) =>
        r.id === editId ? { ...r, comentario, calificacion } : r
      );
      guardar(arr);
      setEditId(null);
    } else {
      const nueva: Reseña = {
        id: Date.now().toString(),
        libroId: libro.id,
        usuario,
        calificacion,
        comentario,
        votos: 0,
      };
      guardar([...reseñas, nueva]);
    }

    setComentario("");
    setCalificacion(5);
  };

  const votar = (id: string, delta: number) => {
    const arr = reseñas.map((r) =>
      r.id === id ? { ...r, votos: r.votos + delta } : r
    );
    guardar(arr);
  };

  const agregarAFavoritos = () => {
    if (!isLoggedIn) return alert("Debes iniciar sesión");
    const favs = JSON.parse(localStorage.getItem(favoritosKey) || "[]");
    if (!favs.includes(libro.id)) {
      favs.push(libro.id);
      localStorage.setItem(favoritosKey, JSON.stringify(favs));
      setEsFavorito(true);
    }
  };

  const iniciarEdicion = (r: Reseña) => {
    setEditId(r.id);
    setComentario(r.comentario);
    setCalificacion(r.calificacion);
    setUsuario(r.usuario);
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="text-lg font-bold text-blue-700">{libro.volumeInfo.title}</h3>
      {libro.volumeInfo.imageLinks?.thumbnail && (
        <img
          src={libro.volumeInfo.imageLinks.thumbnail}
          alt={libro.volumeInfo.title}
          className="my-2 rounded"
        />
      )}
      <p className="text-gray-900">
        <b>Autor:</b> {libro.volumeInfo.authors?.join(", ") || "Desconocido"}
      </p>
      <p className="text-gray-800 text-sm mt-1">
        {libro.volumeInfo.description
          ? libro.volumeInfo.description.slice(0, 150) + "..."
          : "Sin descripción"}
      </p>


      {isLoggedIn && (
        <button
          onClick={agregarAFavoritos}
          className={`px-3 py-1 rounded text-white mt-2 ${
            esFavorito ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={esFavorito}
        >
          {esFavorito ? "❤️ Favorito" : "♡ Agregar a Favoritos"}
        </button>
      )}

      <div className="mt-3 space-y-2" data-testid="reseñas-lista">
        {reseñas.length === 0 ? (
          <p className="text-gray-500 italic">No hay reseñas</p>
        ) : (
          reseñas.map((r) => (
            <div key={r.id} className="border p-2 rounded bg-gray-50">
              <p className="font-medium text-blue-900">
                {r.usuario} — {r.calificacion} ⭐
              </p>
              <p className="text-gray-900">{r.comentario}</p>
              <div className="flex gap-2 text-sm mt-1">
                <button onClick={() => votar(r.id, +1)} className="text-green-600">
                  👍
                </button>
                <button onClick={() => votar(r.id, -1)} className="text-red-600">
                  👎
                </button>
                <span>{r.votos} votos</span>

                {r.usuario === usuario && (
                  <button
                    onClick={() => iniciarEdicion(r)}
                    className="ml-auto px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isLoggedIn && (
        <div className="mt-3 space-y-2" data-testid="reseñas-contenedor">
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
              onClick={agregarOEditar}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editId ? "Guardar cambios" : "Enviar"}
            </button>
          </div>
        </div>
      )}
      {!isLoggedIn && <p className="text-red-600 mt-3">⚠️ Debes iniciar sesión para dejar una reseña</p>}
    </div>
  );
};


export default function Page() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const buscar = async (q: string) => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
    const data = await res.json();
    setLibros(data.items || []);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
        App de Reseñas de Libros
      </h1>

      <div className="max-w-2xl mx-auto">
        {!isLoggedIn && (
          <div className="mb-4 text-center">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        <Buscador onBuscar={buscar} />

        <div className="grid gap-5">
          {libros.map((libro) => (
            <TarjetaLibro key={libro.id} libro={libro} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </div>
    </main>
  );
}
