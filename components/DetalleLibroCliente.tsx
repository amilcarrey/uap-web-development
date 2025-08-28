'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReseñaForm from './ReseñaForm';
import ListaReseñas from './ListaReseñas';

export default function DetalleLibroCliente({ libro, reseñasIniciales }: { libro: any, reseñasIniciales: any[] }) {
  const router = useRouter();
  const info = libro.volumeInfo;
  const [reseñas, setReseñas] = useState<any[]>(reseñasIniciales);

  const portada = (() => {
    const links = info?.imageLinks;
    if (!links) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png';
    const url = links.extraLarge || links.large || links.medium || links.thumbnail;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  })();

  const promedioCalificaciones =
    reseñas.length > 0
      ? reseñas.reduce((acc, r) => acc + r.calificacion, 0) / reseñas.length
      : 0;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
        >
          Regresar
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <img
            src={portada}
            alt={info.title || 'Sin título'}
            className="w-64 lg:w-72 h-auto object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{info.title}</h1>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.round(promedioCalificaciones) }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">★</span>
            ))}
            {Array.from({ length: 5 - Math.round(promedioCalificaciones) }).map((_, i) => (
              <span key={i} className="text-gray-500 text-lg">★</span>
            ))}
            <span className="ml-2 text-sm text-gray-300">
              {promedioCalificaciones.toFixed(1)} / 5
            </span>
          </div>

          <div className="space-y-1 text-gray-300">
            <p><span className="font-semibold text-white">Autor:</span> {info.authors?.join(', ') || 'Desconocido'}</p>
            <p><span className="font-semibold text-white">Publicado:</span> {info.publishedDate || 'N/A'}</p>
            <p><span className="font-semibold text-white">Páginas:</span> {info.pageCount || 'N/A'}</p>
            <p><span className="font-semibold text-white">Categorías:</span> {(info.categories || []).slice(0, 5).join(', ')}{info.categories && info.categories.length > 5 ? ', ...' : ''}</p>
          </div>

          <div
            className="mt-4 text-gray-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: info.description || 'Sin descripción disponible.',
            }}
          ></div>
        </div>
      </div>

      <div className="mt-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Reseñas
        </h2>
        <ListaReseñas libroId={libro.id} reseñas={reseñas} setReseñas={setReseñas} />
        <div className="mt-6">
          <ReseñaForm
            libroId={libro.id}
            onNuevaReseña={(r) => setReseñas(prev => [r, ...prev])}
          />
        </div>
      </div>
    </div>
  );
}
