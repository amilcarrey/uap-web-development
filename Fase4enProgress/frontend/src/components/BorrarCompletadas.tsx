import { useBorrarCompletadas } from "../hooks/useBorrarCompletadas";
import { useTodasLasTareas } from "../hooks/useTodasLasTareas";
import React from "react";

type Props = { boardId: string };

const BorrarCompletadas: React.FC<Props> = ({ tableroId }) => {
  const { data: tareas, isLoading } = useTodasLasTareas(tableroId);
  const borrarCompletadas = useBorrarCompletadas(tableroId);

  if (isLoading || !tareas) return null;

  const tareasCompletadas = tareas.filter((t) => t.completed);
  if (tareasCompletadas.length === 0) return null;

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
