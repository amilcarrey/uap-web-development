import type { Tarea } from "../types";

type TaskItemProps = {
  tarea: Tarea;
  eliminarTarea: (id: string) => void;
  toggleCompletada: (id: string) => void;
};

export function TaskItem({ tarea, eliminarTarea, toggleCompletada }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between p-3 mb-2 rounded-md bg-gray-100 shadow-sm">
      <label className="flex items-center space-x-3 cursor-pointer flex-grow">
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={() => toggleCompletada(tarea.id)}
          className="w-5 h-5 text-blue-600 bg-gray-200 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className={`select-none ${tarea.completada ? "line-through text-gray-400" : "text-gray-800"}`}>
          {tarea.texto}
        </span>
      </label>

      <button
        onClick={() => eliminarTarea(tarea.id)}
        className="ml-4 px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
        aria-label={`Eliminar tarea: ${tarea.texto}`}
      >
        Eliminar
      </button>
    </li>
  );
}
