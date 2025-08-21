import { useState } from "react";
import { useToggleTask, useDeleteTask, useEditTask } from '../hooks/task';
import { useUIStore } from '../stores/uiStore';
import {useConfigStore} from '../stores/configStore';
import toast from "react-hot-toast";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Props {
  task: Task;
  tabId: string;
}

export function TaskItem({ task, tabId }: Props) {
  const upperCase = useConfigStore(state => state.upperCaseDescription);

  const { mutate: toggleTask, isPending: isToggling } = useToggleTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: editTask, isPending: isEditing } = useEditTask();


  const editingTaskId = useUIStore(state => state.editingTaskId);
  const setEditingTaskId = useUIStore(state => state.setEditingTaskId);

  const isEditingMode = editingTaskId === task.id;

  const [editText, setEditText] = useState(task.text);

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


  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText(task.text);
  };

  return (
    <li
      className={`task-item 
        flex items-center justify-between py-[10px] border-b border-[#d3d3d3]
        ${task.completed ? "line-through opacity-70" : ""}`}
    >
      {isEditingMode ? (
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
        <>
          <form onSubmit={handleToggle} className="task-form">
            <label className="form-label">
              <button
                type="submit"
                className="form-button"
                disabled={isToggling}
                title="Completar tarea"
              />
              <span>
                {upperCase ? task.text.toUpperCase() : task.text}
              </span>
            </label>
          </form>

          <div className="flex gap-2">
            <button
              type="button"
              className="form-button"
              onClick={() => setEditingTaskId(task.id)}
              disabled={isEditing}
              title="Editar tarea"
            >
              edit
            </button>
            <form onSubmit={handleDelete} className="delete-form">
              <button
                type="submit"
                className="delete-button"
                disabled={isDeleting}
                title="Eliminar tarea"
              >
                delete
              </button>
            </form>
          </div>
        </>
      )}
    </li>
  );
}
