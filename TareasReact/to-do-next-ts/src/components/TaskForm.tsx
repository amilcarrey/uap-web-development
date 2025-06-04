'use client';

import { useState, FormEvent } from 'react';

type Props = {
  onAdd: (texto: string, tableroId: string) => void;
  tableroId: string | null; // antes era solo string
};


export default function TaskForm({ onAdd, tableroId }: Props) {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = texto.trim();
    if (!tableroId) return null; // no renderizar si no hay tablero
    onAdd(clean, tableroId); // Pasás el id
    setTexto('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
        className="flex-grow border px-4 py-2 rounded placeholder:text-gray-400 text-gray-800"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Agregar
      </button>
    </form>
  );
}
