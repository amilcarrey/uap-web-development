// src/components/BorrarCompletadas.tsx
import { useBorrarCompletadas } from "../hooks/useBorrarCompletadas";
import { useTareas } from "../hooks/useTareas";

const BorrarCompletadas = () => {
  const { data: tareas = [] } = useTareas();
  const borrarCompletadas = useBorrarCompletadas();

  const hayCompletadas = tareas.some((t) => t.completada);

  if (!hayCompletadas) return null;

  return (
    <button
      onClick={() => borrarCompletadas.mutate()}
      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
    >
      Borrar Completadas
    </button>
  );
};

export default BorrarCompletadas;
