// src/pages/api/tareas/limpiar-completadas.ts
import type { APIRoute } from "astro";

export const prerender = false;

const globalState = globalThis.globalState || { tareas: [], filtroActual: 'todas' };
globalThis.globalState = globalState;

export const POST: APIRoute = async () => {
  // Eliminar todas las tareas completadas
  globalState.tareas = globalState.tareas.filter(t => !t.completada);

  // --- Después de limpiar, aplicar filtro actual
  let tareasFiltradas = globalState.tareas;

  if (globalState.filtroActual === 'activas') {
    tareasFiltradas = globalState.tareas.filter(t => !t.completada);
  } else if (globalState.filtroActual === 'completadas') {
    tareasFiltradas = globalState.tareas.filter(t => t.completada);
  }

  // --- Responder con JSON
  return new Response(
    JSON.stringify({ tareas: tareasFiltradas }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};
