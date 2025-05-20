'use client';

import { useEffect, useState } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import FiltroButtons from '@/components/FiltroButtons';

export type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

export default function HomePage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState('todas');

  // Consigna 5: Agregar botones de filtro que permitan ver todas las tareas, las incompletas y las completas. Prestar atención que si se aplica un filtro, no se pierdan datos y se pueda volver a un estado anterior.
  const cargarTareas = async () => {
    const res = await fetch(`/api/tareas?filtro=${filtro}`);
    const data = await res.json();
    setTareas(data);
  };

  useEffect(() => {
    cargarTareas();
  }, [filtro]);

  const handleAdd = async (texto: string) => {
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'agregar', texto }),
    });
    const data = await res.json();
    setTareas((prev) => [...prev, data.tarea]);
  };

  //Consigna 3: Capacidad de completar y descompletar una tarea al clickear en su correspondiente checkbox.
  const handleToggle = async (id: string) => {
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'toggle', id }),
    });
    const data = await res.json();
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? data.tarea : t))
    );
  };

  // Consigna 4: Capacidad de eliminar una tarea de la lista.
  const handleDelete = async (id: string) => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'borrar', id }),
    });
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  // Consigna 5: Eliminar todas las tareas ya completadas al clickear el botón de Clear Completed.
  const handleLimpiar = async () => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'limpiar' }),
    });
    setTareas((prev) => prev.filter((t) => !t.completada));
  };

  return (
    <div className='bg-gray-100 min-h-screen flex max-w-screen'>
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">TO-DO</h1>

      <TaskForm onAdd={handleAdd} />

      <FiltroButtons filtroActual={filtro} onChange={setFiltro} />

      <ul className="space-y-2">
        {tareas.map((t) => (
          <TaskItem
            key={t.id}
            tarea={t}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      <button
        onClick={handleLimpiar}
        className="w-full mt-6 bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
      >
        Limpiar completadas
      </button>
    </main>
    </div>
  );
}
