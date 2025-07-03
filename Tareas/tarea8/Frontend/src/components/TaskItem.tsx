//src\components\TaskItem.tsx


import { useState } from "react";
import { useToggleTask, useDeleteTask, useEditTask } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import { useConfigStore } from '../stores/configStore';
import { useIsViewer } from '../hooks/useUserPermissions';
import type { Task } from '../types/task';
import toast from "react-hot-toast";

// Props para el componente TaskItem

// Props que recibe este componente:
// - task: la tarea a mostrar
// - tabId: ID de la pestaña (para saber de qué lista viene la tarea)
// - onToggle: función callback que se llama cuando se completa/incompleta una tarea
// - onDelete: función callback que se llama cuando se elimina una tarea
interface Props {
  task: Task;
  tabId: string;
}

/**
 * Componente TaskItem
 * Representa una tarea individual en la lista de tareas.
 * Permite marcar la tarea como completada, editar su texto o eliminarla.
 * Utiliza React Query para mutaciones (toggle, delete, edit) y Zustand para el estado global de edición.
 * Muestra formularios y botones según el estado de edición y de carga.
 *
 * Props:
 * - task: Objeto con los datos de la tarea (id, texto, completada)
 * - tabId: ID de la pestaña a la que pertenece la tarea
 */
export function TaskItem({ task, tabId }: Props) {
  const upperCase = useConfigStore(state => state.upperCaseDescription);

  // Detectar si el usuario es VIEWER
  const isViewer = useIsViewer(tabId);

  console.log('📋 [TaskItem] TabId:', tabId, 'TaskId:', task.id, 'isViewer:', isViewer);

  // Hooks de React Query para mutaciones
  const { mutate: toggleTask, isPending: isToggling } = useToggleTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: editTask, isPending: isEditing } = useEditTask();

  // Estado global de edición (Zustand)
  const editingTaskId = useUIStore(state => state.editingTaskId);
  const setEditingTaskId = useUIStore(state => state.setEditingTaskId);

  // ¿Esta tarea está en modo edición?
  const isEditingMode = editingTaskId === task.id;

  // Estado local para el texto del input de edición
  const [editText, setEditText] = useState(task.content); // Cambiado de task.text a task.content

  /**
   * handleToggle
   * Marca o desmarca la tarea como completada.
   */
  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewer) {
      toast.error("No tienes permisos para modificar tareas en este tablero");
      return;
    }

    try {
      toggleTask({ taskId: task.id, tabId, completed: !task.active }); // Cambiado de task.completed a task.active
      toast.success("Estado de la tarea actualizado");

    } catch (err) {
      console.error("Error al cambiar el estado de la tarea:", err);
      toast.error("No se pudo cambiar el estado de la tarea.");
    }
  };

  /**
   * handleDelete
   * Elimina la tarea llamando a la mutación de React Query.
   * Muestra un toast de éxito o error.
   */
  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewer) {
      toast.error("No tienes permisos para eliminar tareas en este tablero");
      return;
    }
    
    try {
      deleteTask({ taskId: task.id, tabId });
      toast.success("Tarea eliminada");

    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      toast.error("No se pudo eliminar la tarea.");
    }
  };

  /**
   * handleEdit
   * Edita el texto de la tarea llamando a la mutación de React Query.
   * Valida que el texto no esté vacío y que haya cambios.
   * Muestra toasts de éxito o error y sale del modo edición al guardar.
   */
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      setEditingTaskId(null);
      return;
    }
    
    if (!editText.trim()) {
      toast.error("El texto de la tarea no puede estar vacio");
      return;
    }
    if (editText === task.content) { // Cambiado de task.text a task.content
      setEditingTaskId(null);
      return;
    }

    try {
      editTask({ taskId: task.id, tabId, text: editText });
      toast.success("La tarea ha sido editada");
      setEditText(editText);
      setEditingTaskId(null);
  
    } catch (err) {
      console.error("Error al editar la tarea:", err);
      toast.error("No se pudo editar la tarea.");
    }
  };

  /**
   * handleCancelEdit
   * Sale del modo edición y restaura el texto original de la tarea.
   */
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText(task.content); // Cambiado de task.text a task.content
  };

  /**
   * handleStartEdit
   * Inicia el modo de edición solo si el usuario no es VIEWER
   */
  const handleStartEdit = () => {
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      return;
    }
    setEditingTaskId(task.id);
  };

  return (
    <li
      className={`task-item 
        flex items-center justify-between py-[10px] border-b border-[#d3d3d3]
        ${task.active ? "line-through opacity-70" : ""}`} // Cambiado de task.completed a task.active
    >
      {isEditingMode ? (
        // Formulario para editar la tarea
        <form onSubmit={handleEdit} className="edit-form flex flex-1 items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            disabled={isEditing}
            autoFocus
          />
          <button type="submit" className="form-button" disabled={isEditing}>Guardar</button>
          <button type="button" className="form-button" onClick={handleCancelEdit} disabled={isEditing}>Cancelar</button>
        </form>
      ) : (
        // Vista normal de la tarea
        <>
          <form onSubmit={handleToggle} className="task-form">
            <label className="form-label">
              <button
                type="submit"
                className={`form-button ${isViewer ? 'opacity-30 cursor-not-allowed bg-gray-200' : ''}`}
                disabled={isToggling || isViewer}
                title={isViewer ? "Solo lectura - No puedes modificar tareas" : "Completar tarea"}
              />
              <span className={`${isViewer ? 'text-gray-500 italic' : ''}`}>
                {upperCase ? task.content.toUpperCase() : task.content} {/* Cambiado de task.text a task.content */}
              </span>
            </label>
          </form>

          <div className="flex gap-2">
            {!isViewer ? (
              <>
                <button
                  type="button"
                  className="form-button"
                  onClick={handleStartEdit}
                  disabled={isEditing}
                  title="Editar tarea"
                >
                  ✏️
                </button>
                <form onSubmit={handleDelete} className="delete-form">
                  <button
                    type="submit"
                    className="delete-button"
                    disabled={isDeleting}
                    title="Eliminar tarea"
                  >
                    🗑️
                  </button>
                </form>
              </>
            ) : (
              <div className="flex gap-2 opacity-30">
                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded border cursor-not-allowed" title="Solo lectura">
                  👁️ Solo lectura
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </li>
  );
}
