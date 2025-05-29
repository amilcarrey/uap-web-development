// src/components/TareaItem.tsx
import { Tarea } from "../types";
import { useToggleTarea } from "../hooks/useToggleTarea";
import { useBorrarTarea } from "../hooks/useBorrarTarea";
import { useTareaEnEdicionStore } from "../store/useTareaEnEdicionStore";

interface Props {
  tarea: Tarea;
}

const TareaItem = ({ tarea }: Props) => {
  const toggleTarea = useToggleTarea();
  const borrarTarea = useBorrarTarea();
  const { setTarea } = useTareaEnEdicionStore();

  return (
    <li
      className={`flex items-center justify-between px-4 py-2 rounded shadow ${
        tarea.completada ? "bg-green-100" : "bg-white"
      }`}
    >
      <label className="flex items-center gap-2 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={() => toggleTarea.mutate(tarea)}
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <span
          className={`text-lg ${
            tarea.completada ? "line-through text-gray-500" : ""
          }`}
        >
          {tarea.titulo}
        </span>
      </label>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => setTarea(tarea)}
          className="text-yellow-500 hover:text-yellow-700"
          aria-label="Editar tarea"
        >
          ✏️
        </button>
        <button
          onClick={() => borrarTarea.mutate(tarea.id)}
          className="text-red-500 hover:text-red-700"
          aria-label="Eliminar tarea"
        >
          X
        </button>
      </div>
    </li>
  );
};

export default TareaItem;
