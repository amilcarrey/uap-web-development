//src\components\TaskInput.tsx

import { useTaskInput } from "../../hooks/useTaskInput";
import { useIsViewer } from "../../hooks/useUserPermissions";

// Props que recibe este componente:
// - tabId: ID de la pestaña actual (sirve para enviar al backend en qué pestaña se agrega la tarea)
// - onTaskAdded: función callback que se ejecuta cuando se agrega una nueva tarea correctamente
export interface Props {
  tabId: string;
  onTaskAdded: (data: any) => void;
}

/**
 * Componente TaskInput
 * Muestra un formulario para ingresar una nueva tarea.
 * Utiliza React Query para enviar la tarea al backend y react-hot-toast para mostrar notificaciones.
 *
 * Props:
 * - tabId: ID de la pestaña actual (para asociar la tarea a la pestaña)
 * - onTaskAdded: callback que se ejecuta cuando se agrega una tarea
 */
export function TaskInput({ tabId, onTaskAdded }: Props) {
  // Detectar si el usuario es VIEWER
  const isViewer = useIsViewer(tabId);

  // Hook para gestión del formulario de tarea
  const {
    text,
    setText,
    loading,
    handleSubmit
  } = useTaskInput(tabId, onTaskAdded);

  // No mostrar el input si el usuario es VIEWER
  if (isViewer) {
    return null;
  }

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
