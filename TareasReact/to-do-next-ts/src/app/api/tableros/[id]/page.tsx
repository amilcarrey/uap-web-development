'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import { useTableroStore } from '@/stores/tableroStore';

type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
  tableroId: string;
};

type Tablero = {
  id: string;
  nombre: string;
  tareas: Tarea[];
};

export default function TableroPage() {
  const { id } = useParams();
  const [tablero, setTablero] = useState<Tablero | null>(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const { tableroId } = useTableroStore();

  useEffect(() => {
    fetch(`/api/tableros/${id}`)
      .then(res => res.json())
      .then(data => setTablero(data));
  }, [id]);

  const recargar = () => {
    fetch(`/api/tableros/${id}`)
      .then(res => res.json())
      .then(data => setTablero(data));
  };

  const agregarTarea = async (texto: string) => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'agregar', texto, tableroId: id }),
    });
    recargar();
  };

  const toggleTarea = async (tareaId: string) => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'toggle', id: tareaId }),
    });
    recargar();
  };

  const borrarTarea = async (tareaId: string) => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'borrar', id: tareaId }),
    });
    recargar();
  };

  const editarTarea = async (id: string, texto: string) => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'editar', id, texto }),
    });
    setEditandoId(null);
    setTextoEditado('');
    recargar();
  };

  if (!tablero) return <p className="text-center mt-10">Cargando tablero...</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-700">{tablero.nombre}</h1>

<TaskForm
  tableroId={String(id)}
  onAdd={(texto) => agregarTarea(texto)}
/>



      <ul className="space-y-2 mt-4">
        {tablero.tareas.map((t) => (
          <li key={t.id}>
            {editandoId === t.id ? (
              <div className="flex gap-2 items-center bg-white rounded p-2 shadow">
                <input
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => editarTarea(t.id, textoEditado)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  ok
                </button>
                <button
                  onClick={() => {
                    setEditandoId(null);
                    setTextoEditado('');
                  }}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  X
                </button>
              </div>
            ) : (
              <TaskItem
                tarea={t}
                onToggle={() => toggleTarea(t.id)}
                onDelete={() => borrarTarea(t.id)}
                onEdit={() => {
                  setEditandoId(t.id);
                  setTextoEditado(t.texto);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
