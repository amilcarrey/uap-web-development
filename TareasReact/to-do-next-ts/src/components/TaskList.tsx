'use client';

import TaskItem from './TaskItem';

type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
  tableroId: string;
};

type Props = {
  tareas: Tarea[];
  isLoading?: boolean;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, texto: string) => void;
  rol?: string | null; // ← acá agregás null
};


export default function TaskList({ tareas, onToggle, onDelete, onEdit, isLoading, rol }: Props) {
  if (isLoading) {
    return <p className="text-gray-500">Cargando tareas...</p>;
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {tareas.map((tarea) => (
        <TaskItem
          key={tarea.id}
          tarea={tarea}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          puedeEditar={rol === 'propietario' || rol === 'editor'}
        />
      ))}
    </div>
  );
}
