import type { Tarea } from "../types";
import { useEliminarTarea } from "../hooks/useEliminarTarea";
import { useToggleTarea } from "../hooks/useToggleTarea";

type TareaListProps = {
  tareas: Tarea[];
  onEditar: (id: number) => void;
};

export function TareaList({ tareas, onEditar }: TareaListProps) {
  const { mutate: eliminarTarea, isPending: eliminando } = useEliminarTarea();
  const { mutate: toggleTarea, isPending: cambiando } = useToggleTarea();

  if (!tareas.length) {
    return <p className="text-gray-500 text-center">No hay tareas</p>;
  }

  return (
    <ul className="space-y-2">
      {tareas.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
        >
          {/* toggle */}
          <button
            onClick={() => toggleTarea(t.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                       bg-pink-300 hover:bg-pink-400 transition"
            disabled={cambiando}
          >
            {t.completada ? "✓" : "○"}
          </button>

          <span
            className={`flex-1 mx-4 text-lg ${
              t.completada ? "line-through text-gray-400" : ""
            }`}
          >
            {t.texto}
          </span>

          <div className="flex gap-2">
            {/* editar */}
            <button
              onClick={() => onEditar(t.id)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                         bg-blue-300 hover:bg-blue-400 transition"
            >
              ✎
            </button>

            {/* eliminar */}
            <button
              onClick={() => eliminarTarea(t.id)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                         bg-pink-300 hover:bg-pink-400 transition"
              disabled={eliminando}
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
