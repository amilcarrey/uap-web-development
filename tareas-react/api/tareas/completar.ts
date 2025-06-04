// src/pages/api/toggle-tarea.ts
import type { APIRoute } from "astro";

const globalState = globalThis.globalState || {
  tareas: [],
  filtroActual: "todas",
};
globalThis.globalState = globalState;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { index } = await request.json();

    if (!isNaN(index) && globalState.tareas[index]) {
      const tarea = globalState.tareas[index];
      const ahora = new Date().toISOString();

      tarea.completada = !tarea.completada;
      tarea.fecha_modificacion = ahora;
      tarea.fecha_realizada = tarea.completada ? ahora : null;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Índice inválido" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error al parsear JSON" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
