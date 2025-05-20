'use client';

export type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

type Props = {
  tarea: Tarea;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ tarea, onToggle, onDelete }: Props) {
  return (
    <li>
      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded shadow">
        <button
        // Consigna 3: Capacidad de completar y descompletar una tarea al clickear en su correspondiente checkbox.
          onClick={() => onToggle(tarea.id)}
          className={`text-xl w-7 h-7 flex items-center justify-center rounded-full border transition ${
            tarea.completada
              ? 'bg-green-100 text-green-700 border-green-500'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {tarea.completada ? '✔️' : ''}
        </button>

        <span
          className={`flex-grow text-lg ${
            tarea.completada ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {tarea.texto}
        </span>
        
        {/* Consigna 4: Borrar una tarea al clickear en su correspondiente botón. */}
        <button
          onClick={() => onDelete(tarea.id)}
          className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
