// src/components/ReminderList.tsx
import { useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useToggleTask } from "../hooks/useToggleTask";
import { useTaskStore } from "../store/taskStore";
import { useConfigStore } from "../store/configStore";
import { useMatch } from "@tanstack/react-router";
import TaskForm from "./TaskForm";
import { BoardSettings } from "./BoardSettings";

export default function ReminderList() {
  const {
    params: { boardId },
  } = useMatch({ from: "/boards/$boardId" });

  const { filter, page, setPage, selectedTask, setSelectedTask, setConfirmDeleteTask } = useTaskStore();
  const { uppercaseDescriptions } = useConfigStore();

  const { data, isLoading, isError, refetch } = useTasks(boardId, page, 5);
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  useEffect(() => {
    refetch();
  }, [filter, page, boardId]);

  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError || !data) return <p>Error al cargar tareas</p>;

  const totalPages = Math.ceil(data.total / 5);

  return (
    <div>
      <BoardSettings />

      <ul className="mb-4">
        {data.reminders.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border rounded mb-2"
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask.mutate({ id: String(task.id), boardId: String(boardId) })}
                className="accent-rose-500"
              />
              {selectedTask?.id === task.id ? (
                <TaskForm boardId={boardId} />
              ) : (
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  } cursor-text`}
                  onClick={() => setSelectedTask(task)}
                >
                  {uppercaseDescriptions ? task.text.toUpperCase() : task.text}
                </span>
              )}
            </div>
            {selectedTask?.id !== task.id && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar tarea"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDeleteTask(task)}
                  className="text-red-500 hover:text-red-700"
                  title="Eliminar tarea"
                >
                  🗑️
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              page === p ? "bg-rose-600 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
