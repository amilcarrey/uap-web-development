'use client'

import { useEffect, useState } from 'react';
import { Reseña } from '../tipos/libro';

interface ReseñaProps {
  libroId: string;
}

const ReseñaComponente = ({ libroId }: ReseñaProps) => {
  const [usuario, setUsuario] = useState(''); 
  const [comentario, setComentario] = useState('');
  const [valoracion, setValoracion] = useState(1);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchReseñas = async () => {
      const res = await fetch('/api/resenas');
      const data = await res.json();
      setReseñas(data.filter((r: Reseña) => r.idLibro === libroId));
    };
    fetchReseñas();
  }, [libroId]);

  // agregar reseña y la guardo en el json
  const agregarReseña = async () => {
    if (comentario.trim() && valoracion >= 1 && valoracion <= 5) { 
      const nuevaReseña: Reseña = {
        id: Date.now().toString(),
        idLibro: libroId,
        usuario,
        valoracion,
        comentario,
        likes: 0,
        dislikes: 0,
      };
      setReseñas([...reseñas, nuevaReseña]);
      setComentario(''); 
      setValoracion(1);

      // Enviar la reseña al servidor
      await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReseña),
      });
    }
  };

  // Funciones de votación
  const votarReseña = (id: string, tipo: 'like' | 'dislike') => {
    setReseñas(reseñas.map(reseña => {
      if (reseña.id === id) {
        if (tipo === 'like') reseña.likes += 1;
        if (tipo === 'dislike') reseña.dislikes += 1;
      }
      return reseña;
    }));
  };


return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md" style={{ color: '#cd8c52' }}>
      <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

      {/* Nombre de usuario */}
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Tu nombre"
        className="w-full p-2 mb-4 rounded-md"
        style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
      />

      {/* Comentario */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Escribe tu reseña aquí"
        className="w-full p-2 mb-4 rounded-md"
        style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
      />

      {/* Valoración + botón */}
      <div className="flex gap-2 mb-4">
        <select
          value={valoracion}
          onChange={(e) => setValoracion(Number(e.target.value))}
          className="p-2 rounded-md"
          style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
        >
          {[1, 2, 3, 4, 5].map((valor) => (
            <option key={valor} value={valor}>
              {valor} Estrella{valor > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <button
          onClick={agregarReseña}
          className="px-4 py-2 rounded-md font-semibold shadow-md"
          style={{ backgroundColor: '#cd8c52', color: '#fff' }}
        >
          Agregar Reseña
        </button>
      </div>

      {/* Listado de reseñas */}
      <div className="reseñas mt-6">
        {reseñas.length > 0 ? (
          reseñas.map((reseña) => (
            <div key={reseña.id} className="mb-4 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{reseña.usuario}</span> -{' '}
                  {reseña.valoracion} Estrella
                  {reseña.valoracion > 1 ? 's' : ''}
                </div>
                <div>
                  <button
                    onClick={() => votarReseña(reseña.id, 'like')}
                    className="mr-2"
                  >
                    👍 {reseña.likes}
                  </button>
                  <button onClick={() => votarReseña(reseña.id, 'dislike')}>
                    👎 {reseña.dislikes}
                  </button>
                </div>
              </div>
              <p>{reseña.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay reseñas aún.</p>
        )}
      </div>
    </div>
  );
};

export default ReseñaComponente;