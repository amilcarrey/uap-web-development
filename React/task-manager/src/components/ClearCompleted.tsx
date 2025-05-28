import type { Tarea } from "../types";
import { useLimpiarTareas } from "../hooks/useLimpiarTareas";

type Props = {
  tareas: Tarea[];
};

export function ClearCompleted({ tareas }: Props) {
  const hasCompleted = tareas.some((t) => t.completada);
  const { mutate: limpiarCompletadas, isPending } = useLimpiarTareas();

  return (
    <button
      onClick={() => limpiarCompletadas()}
      disabled={!hasCompleted || isPending}
      className={`mx-auto block text-green-300 hover:underline font-medium ${
        hasCompleted && !isPending ? "" : "opacity-40 cursor-not-allowed"
      }`}
    >
      {isPending ? "Limpiando..." : "Clear Completed"}
    </button>
  );
}
