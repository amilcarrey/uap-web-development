import type { APIRoute } from "astro";

const globalState = globalThis.globalState || { tareas: [], filtroActual: 'todas' };
globalThis.globalState = globalState;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Cuerpo recibido:", body); // Log para depuración

    const { texto } = body;
    const cleanTexto = texto?.toString().trim();

    if (cleanTexto) {
      globalState.tareas.push({ texto: cleanTexto, completada: false });
      console.log("Tarea agregada:", cleanTexto); // Log para confirmar la tarea
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.warn("Texto vacío recibido"); // Log de advertencia
    return new Response(JSON.stringify({ success: false, error: 'Texto vacío' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error en el servidor:", error); // Log del error
    return new Response(JSON.stringify({ success: false, error: 'Error procesando la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};