'use client';

import { useState, FormEvent } from 'react';

type Props = {
  onAdd: (texto: string) => void;
};

// Consigna 1: Cuando se apriete el botón de agregar, validar que se haya ingresado texto en el input. Agregar una nueva tarea incompleta con ese texto y borrar el input.
export default function TaskForm({ onAdd }: Props) {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = texto.trim();
    if (!clean) return;
    onAdd(clean);
    setTexto('');
  };

// Consigna 2: Realizar lo mismo cuando se apriete la tecla Enter mientras se escribe en el input.
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
        className="flex-grow border px-4 py-2 rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Agregar
      </button>
    </form>
  );
}
