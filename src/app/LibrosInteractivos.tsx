'use client';

import TarjetaLibro from '../../components/TarjetaLibro';
import Header from '../../components/Header';
import { buscarLibros } from './lib/apiGoogleBooks';
import { Libro } from '../../types/libro';
import React, { useState, useRef } from 'react';


export default function LibrosInteractivos({ librosIniciales }: { librosIniciales: Libro[] }) {
  const [libros, setLibros] = useState<Libro[]>(librosIniciales);
  const [pagina, setPagina] = useState(0);
  const [queryActual, setQueryActual] = useState('tendencias');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  const manejarBusqueda = async (tipo: 'title' | 'author' | 'isbn', query: string) => {
    let queryFormateada = query;

    if (tipo === 'author') {
      queryFormateada = `inauthor:${query}`;
    } else if (tipo === 'isbn') {
      queryFormateada = `isbn:${query}`;
    }

    setQueryActual(queryFormateada);
    setPagina(0);

    setLoading(true);
    setError(null);

    try {
      const resultados = await buscarLibros(queryFormateada, 0, 20);
      setLibros(resultados);
    } catch {
      setError('Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const cargarMas = async () => {
  if (loadingRef.current) return;
  loadingRef.current = true;

  try {
    setLoading(true);
    setError(null);

    const nuevaPagina = pagina + 20;
    const resultados = await buscarLibros(queryActual, nuevaPagina, 20);
    setLibros((prev) => [...prev, ...resultados]);
    setPagina(nuevaPagina);
  } catch {
    setError('Error al cargar más libros.');
  } finally {
    setLoading(false);
    loadingRef.current = false;
  }
};




  return (
    <>
      <Header onBuscar={manejarBusqueda} />
      <main className="max-w-6xl mx-auto p-4 mt-6">
        {error && (
          <p className="text-center text-red-600 mb-4">{error}</p>
        )}

        {libros.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500">No hay libros para mostrar.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {libros.map((libro) => (
            <TarjetaLibro key={libro.id} libro={libro} />
          ))}
        </div>

        {libros.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={cargarMas}
              disabled={loading}
              className={`mt-11 mb-10 px-4 py-2 rounded text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black'}`}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
