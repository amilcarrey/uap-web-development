import type { APIRoute } from "astro";
import { obtenerTareas, guardarTareas } from "../../../utils/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('Tarea recibida:', data);

    const descripcion = data.descripcion?.toString().trim();
    const tableroId = Number(data.tableroId);

    if (!descripcion) {
      return new Response(
        JSON.stringify({ error: 'Descripción requerida' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    //verificacion numero valido
    if (isNaN(tableroId)) {
      return new Response(
        JSON.stringify({ error: 'ID de tablero inválido' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const tareas = obtenerTareas();
    const nuevaTarea = {
      id: Date.now(),
      descripcion,
      completada: false,
      tableroId
    };
    tareas.push(nuevaTarea);
    guardarTareas(tareas);

    return new Response(
      JSON.stringify({ task: nuevaTarea }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error en el backend:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar los datos' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
