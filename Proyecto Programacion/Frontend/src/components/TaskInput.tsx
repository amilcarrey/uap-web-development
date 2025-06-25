//src\components\TaskInput.tsx


import { useState } from "react";
import { useAddTask } from "../hooks/task";
import toast from 'react-hot-toast';

// Props que recibe este componente:
// - tabId: ID de la pestaña actual (sirve para enviar al backend en qué pestaña se agrega la tarea)
// - onTaskAdded: función callback que se ejecuta cuando se agrega una nueva tarea correctamente
export interface Props {
  tabId: string;
  onTaskAdded: (data: any) => void;
}

// URL base del backend (se obtiene desde las variables de entorno si estuviera configurado)
const BASE_URL = import.meta.env.API_BASE_URL;

/**
 * Componente TaskInput
 * Muestra un formulario para ingresar una nueva tarea.
 * Utiliza React Query para enviar la tarea al backend y react-hot-toast para mostrar notificaciones.
 *
 * Props:
 * - tabId: ID de la pestaña actual (para asociar la tarea a la pestaña)
 * - onTaskAdded: callback que se ejecuta cuando se agrega una tarea (ya no es necesario si usas React Query para refrescar la lista)
 */
export function TaskInput({ tabId, onTaskAdded }: Props) {

  // Estado local para el texto del input
  const [text, setText] = useState("");

  // Estado local para saber si se está enviando el formulario
  const [loading, setLoading] = useState(false);

  // Hook de React Query para agregar una tarea
  const { mutateAsync } = useAddTask();

  /**
   * handleSubmit
   * Maneja el envío del formulario para agregar una tarea.
   * Valida que el texto no esté vacío, envía la tarea al backend y muestra toasts de éxito o error.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    setLoading(true);

    try {
      const boardId = parseInt(tabId, 10);
      console.log('TaskInput - tabId original:', tabId);
      console.log('TaskInput - boardId convertido:', boardId);
      
      if (isNaN(boardId)) {
        throw new Error('ID de tablero inválido');
      }
      
      const data = await mutateAsync({ text, tabId: boardId });
      setText("");
      onTaskAdded(data);
      toast.success('Tarea Agregada');

    } catch (err) {
      console.error("Error completo al enviar la tarea:", err);
      toast.error("No se pudo agregar la tarea.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      method="POST"
      className="input-container flex mb-[20px] w-full"
      id="taskForm"
      onSubmit={handleSubmit}
    >
      {/* Campos ocultos para acción y pestaña */}
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="tabId" value={tabId} />
      {/* Input de texto para la tarea */}
      <input
        type="text"
        name="text"
        placeholder="What do you need to do?"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="task-input bg-[antiquewhite] p-[10px] border border-[#ccc] rounded-l-[2vh] flex-grow border-r-0"
      />
      {/* Botón para agregar la tarea */}
      <button
        type="submit"
        className="add-button bg-[burlywood] border-none cursor-pointer rounded-r-[2vh] p-[10px_20px] text-[16px] hover:bg-[#a57a5a]"
        disabled={loading}
      >
        Add
      </button>
    </form>
  );
}
