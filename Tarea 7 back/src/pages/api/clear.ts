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

    // Cargar el estado actual
    const { reminders, filter } = await remindersState.loadState();

    // Filtrar solo los recordatorios no completados
    const updatedReminders = reminders.filter(reminder => !reminder.completed);

    // Obtener IDs de los eliminados para posible feedback
    const deletedIds = reminders
      .filter(reminder => reminder.completed)
      .map(reminder => reminder.id);

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
      deletedCount: deletedIds.length,
      deletedIds
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error clearing completed reminders:", error);
    return new Response(JSON.stringify({ 
      error: "Error interno al limpiar recordatorios completados" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};