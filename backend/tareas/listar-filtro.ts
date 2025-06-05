import type { APIRoute } from "astro";

export const prerender = false;

const globalState = globalThis.globalState || { tareas: [], filtroActual: "todas" };
globalThis.globalState = globalState;

export const POST: APIRoute = async ({ request }) => {
  const { filtro } = await request.json();

  globalState.filtroActual = filtro;

  let tareasFiltradas = globalState.tareas;
  if (filtro === "activas") {
    tareasFiltradas = globalState.tareas.filter((t) => !t.completada);
  } else if (filtro === "completadas") {
    tareasFiltradas = globalState.tareas.filter((t) => t.completada);
  }

  return new Response(
    JSON.stringify({ tareas: tareasFiltradas }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
