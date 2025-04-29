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
    const isFormData = contentType === "application/x-www-form-urlencoded";
    let id: string | undefined;

    // Obtener el ID
    if (isFormData) {
      const formData = await request.formData();
      id = formData.get("id")?.toString();
    } else {
      const jsonData = await request.json();
      id = jsonData.id;
    }

    // Validar ID
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Se requiere el ID del recordatorio" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cargar y actualizar estado
    const { reminders, filter } = await remindersState.loadState();
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );

    // Verificar si se actualizó
    const wasUpdated = updatedReminders.some(r => 
      r.id === id && r.completed !== reminders.find(or => or.id === id)?.completed
    );

    if (!wasUpdated) {
      return new Response(
        JSON.stringify({ error: "Recordatorio no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Guardar estado
    await remindersState.saveState({ reminders: updatedReminders, filter });

    // Respuesta para fetch (JSON)
    if (!isFormData) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          reminders: updatedReminders, 
          filter,
          updatedId: id 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Respuesta para formulario tradicional (redirección)
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/",  // Redirige a la página principal
        "Set-Cookie": `last_toggled=${id}; Path=/; Max-Age=5`
      }
    });

  } catch (error) {
    console.error("Error toggling reminder:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al actualizar el recordatorio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};