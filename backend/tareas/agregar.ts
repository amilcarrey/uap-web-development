// src/pages/api/agregar.ts
import type { APIRoute } from "astro";

const globalState = globalThis.globalState || {
  tareas: [],
  filtroActual: "todas",
};
globalThis.globalState = globalState;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { texto } = body;
    const cleanTexto = texto?.toString().trim();

    if (cleanTexto) {
      const now = new Date().toISOString();

      globalState.tareas.push({
        texto: cleanTexto,
        completada: false,
        fecha_creacion: now,
        fecha_modificacion: now,
        fecha_realizada: null,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Texto vacío" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error procesando la solicitud",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
