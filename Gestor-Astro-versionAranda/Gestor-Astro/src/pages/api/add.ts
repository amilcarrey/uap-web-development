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
        const acceptHeader = request.headers.get("accept");
        const wantsJSON = acceptHeader?.includes('application/json') || contentType?.includes('application/json');

        // Validación de Content-Type
        if (!contentType?.includes('application/x-www-form-urlencoded') && 
            !contentType?.includes('application/json')) {
            return new Response(JSON.stringify({ error: "Tipo de contenido no soportado" }), { 
                status: 415,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Obtener datos
        let text: string | undefined;
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData();
            text = formData.get('text')?.toString().trim();
        } else {
            const data = await request.json();
            text = data.text?.trim();
        }

        // Validación de texto
        if (!text || text.length < 2) {
            return new Response(JSON.stringify({ error: "El texto debe tener al menos 2 caracteres" }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear recordatorio
        const newReminder: Reminder = {
            id: crypto.randomUUID(),
            text,
            completed: false
        };

        // Actualizar estado
        const { reminders, filter } = await remindersState.loadState();
        await remindersState.saveState({
            reminders: [...reminders, newReminder],
            filter
        });

        // Respuesta diferenciada
        return wantsJSON 
            ? new Response(JSON.stringify(newReminder), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            })
            : new Response(null, {
                status: 303,
                headers: { "Location": "/" }
            });

    } catch (error) {
        console.error("Error en el endpoint:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};