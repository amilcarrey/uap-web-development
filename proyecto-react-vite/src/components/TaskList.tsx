import { useState } from "react";
import TaskItem from "./TaskItem";
import { useTasks } from "../api/useTasks";
import type { Task } from "../state/taskStore";
import TaskForm from "./TaskForm";

export default function TaskList({ boardId }: { boardId: string }) {
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isError } = useTasks(boardId);

  if (isLoading) return <p className="text-center">Cargando tareas...</p>;
  if (isError || !data) return <p className="text-center text-red-500">Error al cargar tareas</p>;

  const filtered = data.filter((task: Task) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.completed
      : !task.completed
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-center">
        <TaskForm boardId={boardId} />
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded ${filter === "all" ? "bg-black text-white" : "bg-gray-300"}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-1 rounded ${filter === "pending" ? "bg-black text-white" : "bg-gray-300"}`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded ${filter === "completed" ? "bg-black text-white" : "bg-gray-300"}`}
        >
          Completadas
        </button>
      </div>

      <ul className="flex flex-col items-center gap-4 bg-orange-100 w-1/2 p-4 rounded">
        {paginated.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-400"
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-400"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
