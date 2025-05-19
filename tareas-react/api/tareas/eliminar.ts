import type { APIRoute } from "astro";

const globalState = globalThis.globalState || { tareas: [], filtroActual: 'todas' };
globalThis.globalState = globalState;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { index } = await request.json();

    if (!isNaN(index) && globalState.tareas[index]) {
      globalState.tareas.splice(index, 1);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Índice inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("Error en API eliminar:", err); // 🔍 AÑADÍ ESTO
    return new Response(JSON.stringify({ success: false, error: 'Error procesando la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
