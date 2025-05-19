import type { Tarea } from "../types";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tareas: Tarea[];
  eliminarTarea: (id: string) => void;
  toggleCompletada: (id: string) => void;
};

export function TaskList({ tareas, eliminarTarea, toggleCompletada }: TaskListProps) {
  if (tareas.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No hay tareas para mostrar.</p>;
  }

  return (
    <ul className="max-w-xl mx-auto mt-6">
      {tareas.map((tarea) => (
        <TaskItem
          key={tarea.id}
          tarea={tarea}
          eliminarTarea={eliminarTarea}
          toggleCompletada={toggleCompletada}
        />
      ))}
    </ul>
  );
}
