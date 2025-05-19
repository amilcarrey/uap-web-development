import { useState } from "react";

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
 * Se encarga de mostrar un formulario para ingresar una nueva tarea.
 * Al hacer submit, envía los datos al backend y, si todo sale bien, ejecuta un callback que actualiza el estado en el componente padre.
 */
export function TaskInput({ tabId, onTaskAdded }: Props) {
  // Estado para guardar el texto que el usuario escribe en el input
  const [text, setText] = useState("");

  // Estado para saber si se está enviando el formulario (sirve para mostrar loading, desactivar el botón, etc.)
  const [loading, setLoading] = useState(false);

  /**
   * handleSubmit
   * Función que maneja el envío del formulario.
   * Se asegura de validar que el texto no esté vacío, envía los datos al servidor y maneja errores.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del form (recargar la página)

    // No hacemos nada si el texto está vacío o solo tiene espacios
    if (!text.trim()) return;

    setLoading(true); // Activamos el estado de carga

    try {
      // Armamos el formulario para enviar los datos al backend
      const formData = new FormData();
      formData.append("action", "add");   // le indicamos al backend que queremos agregar
      formData.append("tabId", tabId);    // le pasamos el ID de la pestaña actual
      formData.append("text", text);      // y el texto de la tarea

      // Enviamos la solicitud POST al servidor
      const response = await fetch(`http://localhost:4321/api/tasks`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      // Obtenemos la respuesta como texto (por si no es JSON válido, para debug)
      const raw = await response.text();
      console.log("Respuesta cruda del servidor:", raw);

      // Si la respuesta no es exitosa (status fuera del 200-299), lanzamos error
      if (!response.ok) {
        throw new Error("Respuesta no OK del servidor");
      }

      try {
        // Intentamos parsear el texto como JSON
        const data = JSON.parse(raw);
        setText("");           // Limpiamos el campo de texto
        onTaskAdded(data);     // Ejecutamos el callback para avisarle al padre que se agregó una tarea
      } catch (err) {
        // Si el JSON no es válido, mostramos un error en consola y en pantalla
        console.error("Error al parsear JSON:", err);
        alert("La respuesta del servidor no es válida. Revisá la consola.");
      }
    } catch (err) {
      // Cualquier otro error (problemas de red, etc.)
      console.error("Error al enviar la tarea:", err);
      alert("No se pudo agregar la tarea.");
    } finally {
      setLoading(false); // Quitamos el estado de carga, pase lo que pase
    }
  };

  return (
    <form
      method="POST"
      className="input-container flex mb-[20px] w-full"
      id="taskForm"
      onSubmit={handleSubmit}
    > 
      {/* Inputs ocultos por si el backend necesita los valores en el form directamente */}
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="tabId" value={tabId} />

      {/* Campo de texto donde el usuario escribe la tarea */}
      <input
        type="text"
        name="text"
        placeholder="What do you need to do?"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="task-input
          bg-[antiquewhite] p-[10px] border border-[#ccc] rounded-l-[2vh] flex-grow border-r-0"
      />

      {/* Botón para enviar el formulario */}
      <button
        type="submit"
        className="add-button
          bg-[burlywood] border-none cursor-pointer rounded-r-[2vh] p-[10px_20px] text-[16px] hover:bg-[#a57a5a]"
        disabled={loading} // lo desactivamos si está enviando
      >
        Add
      </button>
    </form>
  );
}
