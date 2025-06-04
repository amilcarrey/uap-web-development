'use client';

import { Tarea } from '@/lib/tareas';
import { useConfigStore } from '@/stores/configStore';

type Props = {
  tarea: Tarea;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
};

export default function TaskItem({ tarea, onToggle, onDelete, onEdit }: Props) {
  const { mayusculas } = useConfigStore();

  return (
    <div className="flex items-center justify-between bg-white rounded p-3 shadow">
      <button
        onClick={() => onToggle?.(tarea.id)}
        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
          tarea.completada ? 'bg-green-500 border-green-500' : 'border-gray-400'
        }`}
        title="Marcar como completada"
      >
        {tarea.completada && (
          <span className="text-white text-sm font-bold">✓</span>
        )}
      </button>

      <span className="flex-1 text-gray-700">
        {mayusculas ? tarea.texto.toUpperCase() : tarea.texto}
      </span>

      <div className="flex gap-2 ml-3">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800"
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete?.(tarea.id)}
          className="text-red-600 hover:text-red-800"
          title="Eliminar"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
