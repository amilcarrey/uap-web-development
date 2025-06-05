// src/pages/api/tareas/[id].ts
import type { APIRoute } from "astro";

type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  fecha_realizada: string | null;
};

const globalState: { tareas: Tarea[] } = globalThis.globalState || { tareas: [] };
globalThis.globalState = globalState;

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID no proporcionado" }), { status: 400 });
  }

  const tarea = globalState.tareas.find((t) => t.id === id);
  if (!tarea) {
    return new Response(JSON.stringify({ error: "Tarea no encontrada" }), { status: 404 });
  }

  try {
    const body = await request.json();

    if (body.texto !== undefined) tarea.texto = body.texto.trim();
    if (body.completada !== undefined) tarea.completada = body.completada;
    if (body.fecha_realizada !== undefined) tarea.fecha_realizada = body.fecha_realizada;

    tarea.fecha_modificacion = new Date().toISOString();

    return new Response(JSON.stringify({ success: true, tarea }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
