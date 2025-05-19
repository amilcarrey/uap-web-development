import { useState } from "react";

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
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Componente TaskItem
 * Representa una tarea individual de la lista.
 * Permite marcarla como completada (o deshacerlo), y también eliminarla.
 * Usa formularios HTML para enviar las acciones, simulando una estructura clásica pero manejada vía JavaScript con `fetch`.
 */
export function TaskItem({ task, tabId, onToggle, onDelete }: Props) {
  // Estado para indicar si se está procesando la acción de completar/incompletar la tarea
  const [loading, setLoading] = useState(false);

  // Estado para indicar si se está procesando la eliminación
  const [deleting, setDeleting] = useState(false);

  // Estado local para reflejar si la tarea está completada. Inicialmente viene de props, pero se actualiza internamente cuando cambia.
  const [completed, setCompleted] = useState(task.completed);

  /**
   * handleToggle
   * Maneja el evento de completar o descompletar una tarea.
   * Envía un formulario al backend con la acción `toggle` y actualiza el estado si todo sale bien.
   */
  const handleToggle = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    setLoading(true);   // Indicamos que se está cargando

    const updatedCompleted = !completed; // Alternamos el estado (si estaba completo, lo marcamos como incompleto y viceversa)

    // Creamos el objeto FormData con los valores que necesita el backend
    const formData = new FormData();
    formData.append("action", "toggle");
    formData.append("taskId", task.id);
    formData.append("tabId", tabId);
    formData.append("completed", String(completed)); // Enviamos el valor actual, el backend se encargará del cambio

    try {
      const response = await fetch(`http://localhost:4321/api/tasks`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al completar tarea");

      setCompleted(updatedCompleted);       // Actualizamos el estado local
      onToggle(task.id, updatedCompleted);  // Notificamos al componente padre que la tarea cambió
    } catch (err) {
      console.error(err);
      alert("No se pudo completar la tarea");
    } finally {
      setLoading(false); // Terminamos la carga sin importar si fue éxito o error
    }
  };

  /**
   * handleDelete
   * Maneja el evento de eliminar una tarea.
   * Envía un formulario con la acción `delete` al backend y elimina la tarea del estado si fue exitoso.
   */
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenimos el envío normal del formulario
    setDeleting(true);  // Activamos estado de "borrando"

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("taskId", task.id);
    formData.append("tabId", tabId);

    try {
      const response = await fetch(`http://localhost:4321/api/tasks`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tarea");

      onDelete(task.id); // Notificamos al padre que esta tarea fue eliminada
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la tarea");
    } finally {
      setDeleting(false); // Desactivamos el estado de borrado
    }
  };

  return (
    <li
      className={`task-item 
        flex items-center justify-between py-[10px] border-b border-[#d3d3d3]
        ${completed ? "line-through opacity-70" : ""}`} // Si está completada, tachamos el texto y bajamos la opacidad
    >
      {/* Formulario para marcar/desmarcar la tarea como completada */}
      <form onSubmit={handleToggle} className="task-form">
        <label className="form-label">
          <button
            type="submit"
            className="form-button"
            disabled={loading} // desactivamos si está cargando
            title="Completar tarea"
          />
          <span>{task.text}</span> {/* Mostramos el texto de la tarea */}
        </label>
      </form>

      {/* Formulario para eliminar la tarea */}
      <form onSubmit={handleDelete} className="delete-form">
        <button
          type="submit"
          className="delete-button"
          disabled={deleting} // desactivamos si está en proceso de borrado
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </form>
    </li>
  );
}
