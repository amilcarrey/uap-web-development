import type { Tarea } from "../types";

type TareaListProps = {
  tareas: Tarea[];
  toggleTarea: (index: number) => void;
  eliminarTarea: (index: number) => void;
};

export function TareaList({ tareas, toggleTarea, eliminarTarea }: TareaListProps) {
  if (tareas.length === 0) {
    return <p className="text-gray-500 text-center">No hay tareas</p>;
  }

  return (
    <ul className="space-y-2">
      {tareas.map((tarea, index) => (
        <li
          key={index}
          className="flex justify-between items-center border border-gray-200 rounded-md p-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => toggleTarea(index)}
            />
            <span
              className={`${
                tarea.completada ? "line-through text-gray-400" : ""
              }`}
            >
              {tarea.texto}
            </span>
          </div>
          <button
            onClick={() => eliminarTarea(index)}
            className="text-red-500 text-sm hover:underline"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
