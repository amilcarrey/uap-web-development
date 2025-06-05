import type { Tarea } from "../types";
import { useLimpiarTareas } from "../hooks/useLimpiarTareas";

type Props = {
  tareas: Tarea[];
};

export function ClearCompleted({ tareas }: Props) {
  const hasCompleted = tareas.some((t) => t.completada);
  const { mutate: limpiarCompletadas, isPending } = useLimpiarTareas();

  const handleClick = () => {
    if (!isPending && hasCompleted) {
      limpiarCompletadas();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!hasCompleted || isPending}
      title="Eliminar todas las tareas completadas"
      className={`mx-auto block text-green-300 hover:underline font-medium transition ${
        hasCompleted && !isPending ? "" : "opacity-40 cursor-not-allowed"
      }`}
    >
      {isPending ? "Limpiando..." : "Limpiar completadas"}
    </button>
  );
}
