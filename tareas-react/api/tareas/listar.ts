// /api/tareas/listar.ts
import type { APIRoute } from "astro";

export const prerender = false;

const globalState = globalThis.globalState || { tareas: [], filtroActual: "todas" };
globalThis.globalState = globalState;

export const GET: APIRoute = async ({ url }) => {
  const filtro = url.searchParams.get("filtro") || "todas";
  globalState.filtroActual = filtro;

  let tareasFiltradas = globalState.tareas;

  if (filtro === "activas") {
    tareasFiltradas = globalState.tareas.filter((t) => !t.completada);
  } else if (filtro === "completadas") {
    tareasFiltradas = globalState.tareas.filter((t) => t.completada);
  }

  return new Response(
    JSON.stringify({ tareas: tareasFiltradas, filtroActual: filtro }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
