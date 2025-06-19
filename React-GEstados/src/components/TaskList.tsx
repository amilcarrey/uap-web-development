import { useUIStore, useConfigStore } from "../store";

type Tarea = {
  id: number;
  text: string;
  completada: boolean;
  boardId: string;
};

type Props = {
  tareas: Tarea[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  error: string | null;
};

export default function TaskList({ tareas, onToggle, onDelete, loading, error }: Props) {
  const setTareaEditando = useUIStore((state) => state.setTareaEditando);
  const { mostrarMayusculas } = useConfigStore();
  console.log("ConfigPage mostrarMayusculas:", mostrarMayusculas);

  if (loading) {
    return <p className="text-center text-blue-500">Cargando tareas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (tareas.length === 0) {
    return <p className="text-center text-gray-500">No hay tareas</p>;
  }

  return (
    <div className="mt-6">
      {tareas.map((t, index) => (
        <div
          key={t.id}
          className={`flex justify-between items-center py-2 ${
            index !== 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <button
            onClick={() => onToggle(t.id)}
            className="text-xl focus:outline-none"
            title="Marcar como completada"
          >
            {t.completada ? "✓" : "◯"}
          </button>

          <span
            className={`flex-1 mx-4 ${t.completada ? "line-through text-gray-400" : ""}`}
          >
            {mostrarMayusculas ? t.text.toUpperCase() : t.text}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (t.completada) {
                  alert("No se puede editar una tarea completada");
                  return;
                }
                setTareaEditando(t);
              }}
              className={`text-blue-500 hover:underline ${t.completada ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Editar tarea"
              disabled={t.completada}
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(t.id)}
              className="text-red-500 hover:underline"
              title="Eliminar tarea"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
