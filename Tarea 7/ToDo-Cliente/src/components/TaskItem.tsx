//src\components\TaskItem.tsx


import { useState } from "react";
import { useToggleTask, useDeleteTask, useEditTask } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import toast from "react-hot-toast";

// Interfaz que describe la estructura de una tarea:
// - id: identificador único
// - text: contenido de la tarea
// - completed: si está completada o no
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

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
  // Hooks de React Query para mutaciones
  const { mutate: toggleTask, isPending: isToggling } = useToggleTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: editTask, isPending: isEditing } = useEditTask();

  // Estado global de edición (Zustand)
  // editingTaskId: id de la tarea que está en modo edición (o null)
  // setEditingTaskId: función para cambiar la tarea en edición
  const editingTaskId = useUIStore(state => state.editingTaskId);
  const setEditingTaskId = useUIStore(state => state.setEditingTaskId);

  // ¿Esta tarea está en modo edición?
  const isEditingMode = editingTaskId === task.id;

  // Estado local para el texto del input de edición
  const [editText, setEditText] = useState(task.text);

  /**
   * handleToggle
   * Marca o desmarca la tarea como completada.
   * Llama a la mutación de React Query y muestra un toast de éxito o error.
   */
  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      toggleTask({ taskId: task.id, tabId, completed: !task.completed });
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
    if (!editText.trim()) {
      toast.error("El texto de la tarea no puede estar vacio");
      return;
    }
    if (editText === task.text) {
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
    setEditText(task.text);
  };

  return (
    <li
      className={`task-item 
        flex items-center justify-between py-[10px] border-b border-[#d3d3d3]
        ${task.completed ? "line-through opacity-70" : ""}`} // Si está completada, tachamos el texto y bajamos la opacidad
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
          {/* Formulario para marcar/desmarcar la tarea como completada */}
          <form onSubmit={handleToggle} className="task-form">
            <label className="form-label">
              <button
                type="submit"
                className="form-button"
                disabled={isToggling} // desactivamos si está cargando
                title="Completar tarea"
              />
              <span>{task.text}</span> {/* Mostramos el texto de la tarea */}
            </label>
          </form>

          {/* Controles para editar o eliminar la tarea */}
          <div className="flex gap-2">
            <button
              type="button"
              className="form-button"
              onClick={() => setEditingTaskId(task.id)}
              disabled={isEditing}
              title="Editar tarea"
            >
              ✏️
            </button>
            {/* Formulario para eliminar la tarea */}
            <form onSubmit={handleDelete} className="delete-form">
              <button
                type="submit"
                className="delete-button"
                disabled={isDeleting} // desactivamos si está en proceso de borrado
                title="Eliminar tarea"
              >
                🗑️
              </button>
            </form>
          </div>
        </>
      )}
    </li>
  );
}
