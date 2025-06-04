import React from "react";
import { type Task } from "../types";
import { type UseMutationResult } from "@tanstack/react-query";


interface TaskListProps {
  currentTasks: Task[];
  editingTaskId: number | null;
  setEditingTaskId: (id: number | null) => void;
  setInputText: (text: string) => void;
  descripcionMayusculas: boolean;
  deleteTaskMutation: UseMutationResult<any, unknown, number>;
  toggleCompleteMutation: UseMutationResult<any, unknown, number>;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

 export const TaskList: React.FC<TaskListProps> = ({
  currentTasks,
  editingTaskId,
  setEditingTaskId,
  setInputText,
  descripcionMayusculas,
  deleteTaskMutation,
  toggleCompleteMutation,
  addToast,
}) => {

     if (currentTasks.length === 0) {
    return (
      <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
        No hay tareas para mostrar.
      </p>
    );
  }

  return(

    <ul className="space-y-4">
          {currentTasks.map((task: Task) => (
            <li
              key={task.id}
              className={`border rounded p-3 flex items-center gap-4 ${
                task.completada ? "bg-blue-100 dark:bg-green-800" : "bg-white dark:bg-gray-700"
              }`}
            >
              {/* Botón para marcar como completada/incompleta */}
              <button
                onClick={() =>
                  toggleCompleteMutation.mutate(task.id, {
                    onError: () => addToast("Error al actualizar tarea.", "error"),
                  })
                }
                className={`w-6 h-6 flex items-center justify-center rounded ${
                  task.completada ? "text-white" : "text-black"
                }`}
                aria-label={`Marcar tarea ${task.descripcion} como ${
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
                  {descripcionMayusculas ? task.descripcion.toUpperCase() : task.descripcion}
                </span>
                {editingTaskId === task.id && (
                  <span className="ml-2 text-gray-500 dark:text-gray-300">⚙️</span>
                )}
              </span>

              {/* Botón de editar */}
              {editingTaskId !== task.id && (
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setInputText(task.descripcion);
                  }}
                  className="text-yellow-600 hover:text-yellow-800 font-semibold"
                  aria-label={`Editar tarea ${task.descripcion}`}
                >
                  ✏️
                </button>
              )}

              {/* Botón de eliminar */}
              <button
                onClick={() =>
                  deleteTaskMutation.mutate(task.id, {
                    onSuccess:() => addToast("Tarea eliminada.", "info"),
                    onError: () => addToast("Error al eliminar tarea.", "error"),
                  })
                }
                className="text-red-600 hover:text-red-800 font-semibold"
                aria-label={`Eliminar tarea ${task.descripcion}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

  )

}