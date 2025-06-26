// src/components/TaskList.tsx
import { useToggleTask } from "../hooks/useToggleTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useTaskStore } from "../store/taskStore";
import { useConfigStore } from "../store/configStore";
import TaskForm from "./TaskForm";

interface TaskListProps {
  tasks: any[];
  boardId: string;
}

export function TaskList({ tasks, boardId }: TaskListProps) {
  const { selectedTask, setSelectedTask, setConfirmDeleteTask } = useTaskStore();
  const uppercaseDescriptions = useConfigStore((state: any) => state.uppercaseDescriptions);
  const toggleTask = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-pink-200">
        <p className="text-lg text-pink-700">No hay recordatorios aún</p>
        <p className="text-sm text-pink-600 mt-2">
          Crea tu primer recordatorio usando el formulario superior
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-pink-100"
        >
          {selectedTask?.id === task.id ? (
            <TaskForm boardId={boardId} />
          ) : (
            <div className="flex items-center justify-between gap-4">
              {/* Línea principal */}
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTask.mutate({ id: String(task.id), boardId })
                  }
                  className="accent-rose-500 w-5 h-5"
                />
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-pink-800"
                  } font-medium flex-1 cursor-pointer`}
                  onClick={() => setSelectedTask(task)}
                >
                  {uppercaseDescriptions
                    ? (task.name ?? "").toUpperCase()
                    : task.name ?? ""}
                </span>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-blue-500 hover:text-blue-700 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    task.completed
                      ? deleteTask(task.id.toString())
                      : setConfirmDeleteTask(task);
                  }}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
