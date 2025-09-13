'use client';

import { useState } from 'react';
import { saveReview } from '@/lib/localStorage';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState(''); // Nuevo estado para el nombre

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || !text || !name) {
      alert('Por favor, completa todos los campos: nombre, calificación y reseña.');
      return;
    }
    saveReview(bookId, { rating, text, name }); // Incluye el nombre en la reseña
    setRating(0);
    setText('');
    setName(''); // Limpia el campo del nombre
    window.location.reload(); // Recarga para ver cambios
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
      <button type="submit" className="bg-green-500 text-white p-2">
        Enviar Reseña
      </button>
    </form>
  );
}