import type { APIRoute } from "astro";
import { remindersState } from "../../state";

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type");
    let id: string | undefined;

    // Obtener el ID según el content-type
    if (contentType === "application/x-www-form-urlencoded") {
      const formData = await request.formData();
      id = formData.get("id")?.toString();
    } else if (contentType === "application/json") {
      const jsonData = await request.json();
      id = jsonData.id;
    }

    // Validar que el ID existe
    if (!id) {
      return new Response(JSON.stringify({
        error: "Se requiere el ID del recordatorio"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Cargar el estado actual
    const { reminders, filter } = await remindersState.loadState();

    // Verificar si el recordatorio existe
    const exists = reminders.some(r => r.id === id);
    if (!exists) {
      return new Response(JSON.stringify({
        error: "Recordatorio no encontrado"
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filtrar el recordatorio a eliminar
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);

    // Guardar el estado actualizado
    await remindersState.saveState({ 
      reminders: updatedReminders,
      filter 
    });

    // Responder según el content-type
    if (contentType === "application/x-www-form-urlencoded") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/"
        }
      });
    }

    // Respuesta JSON
    return new Response(JSON.stringify({
      success: true,
      deletedId: id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error deleting reminder:", error);
    return new Response(JSON.stringify({ 
      error: "Error interno al eliminar el recordatorio" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};