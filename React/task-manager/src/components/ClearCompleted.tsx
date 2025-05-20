import type { Tarea } from "../types";

type ClearCompletedProps = {
  tareas: Tarea[];                 // lista completa, para saber si hay completadas
  clearCompleted: () => void;      // función que hace el fetch al backend
};

// export function ClearCompleted({
//   tareas,
//   clearCompleted,
// }: ClearCompletedProps) {
//   const hasCompleted = tareas.some((t) => t.completada);

//   return (
//     <button
//       type="button"
//       onClick={clearCompleted}
//       disabled={!hasCompleted}
//       className={`text-red-600 text-sm hover:underline ${
//         hasCompleted ? "" : "opacity-40 cursor-not-allowed"
//       }`}
//     >
//       Limpiar completadas
//     </button>
//   );
// }

export function ClearCompleted({ tareas, clearCompleted }: ClearCompletedProps) {
  const hasCompleted = tareas.some((t) => t.completada);
  return (
    <button
      onClick={clearCompleted}
      disabled={!hasCompleted}
      className={`mx-auto block text-green-300 hover:underline font-medium ${
        hasCompleted ? "" : "opacity-40 cursor-not-allowed"
      }`}
    >
      Clear Completed
    </button>
  );
}
