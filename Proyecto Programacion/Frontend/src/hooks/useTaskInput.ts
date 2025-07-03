// src/hooks/useTaskInput.ts
import { useState } from "react";
import { useAddTask } from "./task";
import toast from 'react-hot-toast';

/**
 * Hook personalizado para la gestión del input de tareas
 * Encapsula la lógica de estado, validación y envío de nuevas tareas
 */
export function useTaskInput(tabId: string, onTaskAdded: (data: any) => void) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useAddTask();

  /**
   * Valida el input de la tarea
   */
  const validateInput = (text: string): boolean => {
    return text.trim().length > 0;
  };

  /**
   * Parsea y valida el tabId
   */
  const parseTabId = (tabId: string): number => {
    const boardId = parseInt(tabId, 10);
    if (isNaN(boardId)) {
      throw new Error('ID de tablero inválido');
    }
    return boardId;
  };

  /**
   * Envía la nueva tarea al backend
   */
  const submitTask = async () => {
    if (!validateInput(text)) return false;
    
    setLoading(true);
    try {
      const boardId = parseTabId(tabId);
      console.log('TaskInput - tabId original:', tabId);
      console.log('TaskInput - boardId convertido:', boardId);
      
      const data = await mutateAsync({ text, tabId: boardId });
      setText("");
      onTaskAdded(data);
      toast.success('Tarea Agregada');
      return true;
      
    } catch (err) {
      console.error("Error completo al enviar la tarea:", err);
      toast.error("No se pudo agregar la tarea.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitTask();
  };

  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setText("");
    setLoading(false);
  };

  return {
    text,
    setText,
    loading,
    handleSubmit,
    resetForm,
    isValid: validateInput(text)
  };
}
