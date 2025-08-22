'use client';

import { useState } from 'react';
import { saveReview } from '../lib/localStorage';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null); // Nuevo estado para el mensaje de error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || !text || !name) {
      setError('Por favor, completa todos los campos: nombre, calificación y reseña.');
      return;
    }
    setError(null); // Limpiar error si el formulario es válido
    saveReview(bookId, { rating, text, name });
    setRating(0);
    setText('');
    setName('');
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Tu nombre:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresa tu nombre"
          className="border p-2 w-full mt-1"
        />
      </div>
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            data-testid="star" // Añadido para pruebas
            role="button" // Añadido para accesibilidad
            aria-label={`Calificar ${star} estrella${star > 1 ? 's' : ''}`} // Añadido para accesibilidad
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu reseña..."
        className="border p-2 w-full mb-2"
      />
      {error && <p className="text-red-500 mb-2" data-testid="error-message">{error}</p>} {/* Mensaje de error en el DOM */}
      <button type="submit" className="bg-green-500 text-white p-2">
        Enviar Reseña
      </button>
    </form>
  );
}