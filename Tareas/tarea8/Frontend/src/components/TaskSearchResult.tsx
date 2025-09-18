import { useState } from "react";
import { useConfigStore } from "../stores/configStore";
import { useToggleTask, useDeleteTask, useEditTask } from "../hooks/task";
import { useIsViewer } from "../hooks/useUserPermissions";
import type { Task } from "../types/task";
import toast from "react-hot-toast";

interface Props {
  task: Task;
  searchTerm: string;
  tabId: string;
}

export function TaskSearchResult({ task, searchTerm, tabId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.content);

  const upperCase = useConfigStore((state) => state.upperCaseDescription);
  const isViewer = useIsViewer(tabId);

  const { mutate: toggleTask } = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: editTask } = useEditTask();

  // 🔍 Resalta el término de búsqueda en el texto
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleToggle = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    toggleTask({ taskId: task.id, tabId, completed: !task.active });
  };

  const handleDelete = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      deleteTask({ taskId: task.id, tabId });
    }
  };

  const handleEdit = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    if (editText.trim() && editText !== task.content) {
      editTask({ taskId: task.id, tabId, text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditText(task.content);
      setIsEditing(false);
    }
  };

  const displayText = upperCase ? task.content.toUpperCase() : task.content;

  return (
    <div className="task-search-result flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
      {/* ✅ Botón de completar */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.active
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        } ${isViewer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={task.active ? "Marcar como pendiente" : "Marcar como completada"}
        disabled={isViewer}
      >
        {task.active && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* 📝 Contenido de la tarea */}
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            className="w-full px-2 py-1 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-indigo-800"
            autoFocus
          />
        ) : (
          <p
            className={`text-sm cursor-pointer ${
              task.active ? "line-through opacity-70" : ""
            }`}
            onClick={() => !isViewer && setIsEditing(true)}
            title={isViewer ? "Solo visualización" : "Clic para editar"}
          >
            {highlightSearchTerm(displayText, searchTerm)}
          </p>
        )}

        {/* 📎 Metadatos */}
        <div className="flex items-center gap-2 mt-1 text-xs text-indigo-500">
          <span>ID: {task.id}</span>
          <span>•</span>
          <span>{task.active ? "✅ Completada" : "⏳ Pendiente"}</span>
          {task.createdAt && (
            <>
              <span>•</span>
              <span>Creada: {new Date(task.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* ✏️ / 🗑️ Acciones */}
      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            <button
              onClick={() => !isViewer && setIsEditing(true)}
              className={`p-1 rounded text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 transition-colors ${
                isViewer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={isViewer ? "Solo visualización" : "Editar tarea"}
              disabled={isViewer}
            >
              ✏️
            </button>

            <button
              onClick={handleDelete}
              className={`p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors ${
                isViewer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={isViewer ? "Solo visualización" : "Eliminar tarea"}
              disabled={isViewer}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
