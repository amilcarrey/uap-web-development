// src/hooks/useTaskOperations.ts
import { useState } from "react";
import { useToggleTask, useDeleteTask, useEditTask } from './task';
import { useUIStore } from '../stores/uiStore';
import { useIsViewer } from './useUserPermissions';
import { validateTaskContent } from '../utils/taskValidation';
import type { Task } from '../types/task';
import toast from "react-hot-toast";

/**
 * Hook personalizado para operaciones de tareas
 * Encapsula toda la lógica de negocio para CRUD de tareas individuales
 */
export function useTaskOperations(task: Task, tabId: string) {
  // Detectar si el usuario es VIEWER
  const isViewer = useIsViewer(tabId);

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
  const [editText, setEditText] = useState(task.content);

  /**
   * Alterna el estado completado/incompleto de la tarea
   */
  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewer) {
      toast.error("No tienes permisos para modificar tareas en este tablero");
      return;
    }

    try {
      toggleTask({ taskId: task.id, tabId, completed: !task.active });
      toast.success("Estado de la tarea actualizado");

    } catch (err) {
      console.error("Error al cambiar el estado de la tarea:", err);
      toast.error("No se pudo cambiar el estado de la tarea.");
    }
  };

  /**
   * Elimina la tarea
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
   * Guarda los cambios de edición
   */
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      setEditingTaskId(null);
      return;
    }
    
    const validation = validateTaskContent(editText);
    if (!validation.isValid) {
      toast.error(validation.error || "Contenido inválido");
      return;
    }
    
    if (editText === task.content) {
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
   * Cancela la edición y restaura el texto original
   */
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText(task.content);
  };

  /**
   * Inicia el modo de edición
   */
  const handleStartEdit = () => {
    if (isViewer) {
      toast.error("No tienes permisos para editar tareas en este tablero");
      return;
    }
    setEditingTaskId(task.id);
  };

  return {
    isViewer,
    isEditingMode,
    editText,
    setEditText,
    isToggling,
    isDeleting,
    isEditing,
    handleToggle,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleStartEdit
  };
}
