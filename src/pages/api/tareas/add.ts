import type { APIRoute } from "astro";
import { obtenerTareas, guardarTareas, renderTareas } from "../../../utils/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('Tarea recibida:', data); 

    const descripcion = data.descripcion?.toString().trim();

    if (!descripcion) {
      return new Response('Descripción requerida', { status: 400 });
    }

    const tareas = obtenerTareas();
    tareas.push({ id: Date.now(), descripcion, completada: false });
    guardarTareas(tareas);

    const html = renderTareas(tareas);
    return new Response(html, { headers: { "Content-Type": "text/html" } });

  } catch (error) {
    console.error('Error en el backend:', error);
    return new Response('Error al procesar los datos', { status: 500 });
  }
};
