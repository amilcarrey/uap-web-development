import type { APIRoute } from "astro";
import { agregarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { descripcion, idTablero } = await request.json();

    if (!descripcion || !idTablero) {
      return new Response(
        JSON.stringify({ error: "Descripción e idTablero son requeridos" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const nuevaTarea = agregarTarea(descripcion.trim(), idTablero);

    if (!nuevaTarea) {
      return new Response(
        JSON.stringify({ error: "La tarea ya existe en este tablero" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, tarea: nuevaTarea }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al agregar tarea" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
