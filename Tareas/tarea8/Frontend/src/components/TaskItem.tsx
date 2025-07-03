import { useState } from "react";
import { useToggleTask, useDeleteTask, useEditTask } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useConfigStore } from '../stores/configStore';
import { useIsViewer } from '../hooks/useUserPermissions';
import type { Task } from '../types/task';
import toast from "react-hot-toast";

interface Props {
  task: Task;
  tabId: string;
}

export function TaskItem({ task, tabId }: Props) {
  const upperCase = useConfigStore(state => state.upperCaseDescription);
  const isViewer = useIsViewer(tabId);

  const { mutate: toggleTask, isPending: isToggling } = useToggleTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: editTask, isPending: isEditing } = useEditTask();

  const editingTaskId = useUIStore(state => state.editingTaskId);
  const setEditingTaskId = useUIStore(state => state.setEditingTaskId);

  const isEditingMode = editingTaskId === task.id;
  const [editText, setEditText] = useState(task.content);

  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      toast.error("No tienes permisos para modificar tareas en este tablero");
      return;
    }
    toggleTask({ taskId: task.id, tabId, completed: !task.active });
    toast.success("Estado de la tarea actualizado");
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      toast.error("No tienes permisos para eliminar tareas en este tablero");
      return;
    }
    deleteTask({ taskId: task.id, tabId });
    toast.success("Tarea eliminada");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      setEditingTaskId(null);
      return;
    }
    if (!editText.trim()) {
      toast.error("El texto de la tarea no puede estar vacío");
      return;
    }
    if (editText === task.content) {
      setEditingTaskId(null);
      return;
    }
    editTask({ taskId: task.id, tabId, text: editText });
    toast.success("La tarea ha sido editada");
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText(task.content);
  };

  const handleStartEdit = () => {
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      return;
    }
    setEditingTaskId(task.id);
  };

  return (
    <li
      className={`task-item flex items-center justify-between py-3 border-b border-indigo-100 ${
        task.active ? "line-through opacity-70" : ""
      }`}
    >
      {isEditingMode ? (
        <form onSubmit={handleEdit} className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border border-indigo-300 rounded px-3 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isEditing}
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            disabled={isEditing}
          >
            Guardar
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            onClick={handleCancelEdit}
            disabled={isEditing}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleToggle} className="flex-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="submit"
                className={`w-4 h-4 rounded-full border-2 ${
                  isViewer
                    ? "opacity-30 cursor-not-allowed bg-gray-200"
                    : "border-indigo-400 hover:border-indigo-600"
                }`}
                disabled={isToggling || isViewer}
                title={isViewer ? "Solo lectura" : "Completar tarea"}
              />
              <span className={`text-sm ${isViewer ? "text-gray-500 italic" : ""}`}>
                {upperCase ? task.content.toUpperCase() : task.content}
              </span>
            </label>
          </form>

          <div className="flex gap-2 ml-4">
            {!isViewer ? (
              <>
                <button
                  type="button"
                  className="text-indigo-500 hover:text-indigo-700 text-sm"
                  onClick={handleStartEdit}
                  disabled={isEditing}
                  title="Editar tarea"
                >
                  Editar
                </button>
                <form onSubmit={handleDelete}>
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={isDeleting}
                    title="Eliminar tarea"
                  >
                    Eliminar
                  </button>
                </form>
              </>
            ) : (
              <span
                className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded border cursor-not-allowed"
                title="Solo lectura"
              >
                Solo lectura
              </span>
            )}
          </div>
        </>
      )}
    </li>
  );
}
