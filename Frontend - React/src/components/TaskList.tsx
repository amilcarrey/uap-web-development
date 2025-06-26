import React from "react";
import { type Task } from "../types";
import { type UseMutationResult } from "@tanstack/react-query";
import { useSettings } from "../context/SettingsContext";

interface TaskListProps {
  currentTasks: Task[];
  editingTaskId: number | null;
  setEditingTaskId: (id: number | null) => void;
  setInputText: (text: string) => void;
  deleteTaskMutation: UseMutationResult<any, unknown, number>;
  toggleCompleteMutation: UseMutationResult<any, unknown, number>;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  currentTasks,
  editingTaskId,
  setEditingTaskId,
  setInputText,
  deleteTaskMutation,
  toggleCompleteMutation,
  addToast,
}) => {
  // Obtener tema desde contexto de configuración
  const { settings } = useSettings();
  const theme = settings?.theme || "light";
  const descripcionMayusculas = settings?.descripcionMayusculas || false;


  // Mostrar mensaje si no hay tareas para mostrar
  if (currentTasks.length === 0) {
    return (
      <p
        className={`text-center text-lg font-semibold ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        No hay tareas para mostrar.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {currentTasks.map((task: Task) => (
        <li
          key={task.id}
          className={`border rounded p-3 flex items-center gap-4 ${
            task.completada
              ? theme === "dark"
                ? "bg-green-800"
                : "bg-blue-100"
              : theme === "dark"
              ? "bg-gray-700"
              : "bg-white"
          }`}
        >
          {/* Botón para marcar tarea como completa/incompleta */}
          <button
            onClick={() =>
              toggleCompleteMutation.mutate(task.id, {
                onError: () => addToast("Error al actualizar tarea.", "error"),
              })
            }
            className={`w-6 h-6 flex items-center justify-center rounded ${
              task.completada
                ? "text-white"
                : theme === "dark"
                ? "text-white"
                : "text-black"
            }`}
            aria-label={`Marcar tarea ${task.title} como ${
              task.completada ? "incompleta" : "completa"
            }`}
          >
            {task.completada ? "🔁" : "✔️"}
          </button>

          {/* Descripción de la tarea */}
          <span className="flex-1 flex items-center">
            <span
              className={`${
                task.completada || editingTaskId === task.id ? "line-through" : ""
              }`}
            >
             {descripcionMayusculas ? task.title.toUpperCase() : task.title}
            </span>
            {/* Indicador de edición */}
            {editingTaskId === task.id && (
              <span
                className={`ml-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                ⚙️
              </span>
            )}
          </span>

          {/* Botón para editar tarea (solo si no está en edición) */}
          {editingTaskId !== task.id && (
            <button
              onClick={() => {
                setEditingTaskId(task.id);
                setInputText(task.title);
              }}
              className={`font-semibold ${
                theme === "dark"
                  ? "text-yellow-400 hover:text-yellow-500"
                  : "text-yellow-600 hover:text-yellow-800"
              }`}
              aria-label={`Editar tarea ${task.title}`}
            >
              ✏️
            </button>
          )}

          {/* Botón para eliminar tarea */}
          <button
            onClick={() =>
              deleteTaskMutation.mutate(task.id, {
                onSuccess: () => addToast("Tarea eliminada.", "info"),
                onError: (error: unknown) => {
                  if (error instanceof Error) {
                    addToast("Error al eliminar tarea: " + error.message, "error");
                  } else {
                    addToast("Error al eliminar tarea: error desconocido", "error");
                  }
                },
              })
            }
            className={`font-semibold ${
              theme === "dark"
                ? "text-red-400 hover:text-red-500"
                : "text-red-600 hover:text-red-800"
            }`}
            aria-label={`Eliminar tarea ${task.title}`}
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
};
