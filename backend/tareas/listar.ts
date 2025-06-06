import type { APIRoute } from "astro";

export const prerender = false;

type Tarea = {
  texto: string;
  completada: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  fecha_realizada: string | null;
};

const globalState: { tareas: Tarea[]; filtroActual: string } =
  globalThis.globalState || { tareas: [], filtroActual: "todas" };
globalThis.globalState = globalState;

export const GET: APIRoute = async ({ url }) => {
  const filtro = url.searchParams.get("filtro") || "todas";
  const page = parseInt(url.searchParams.get("_page") || "1", 10);
  const limit = parseInt(url.searchParams.get("_limit") || "10", 10);

  let tareasFiltradas = globalState.tareas;

  if (filtro === "activas") {
    tareasFiltradas = tareasFiltradas.filter((t) => !t.completada);
  } else if (filtro === "completadas") {
    tareasFiltradas = tareasFiltradas.filter((t) => t.completada);
  }

  const total = tareasFiltradas.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const tareasPaginadas = tareasFiltradas.slice(start, end);

  return new Response(JSON.stringify({ tareas: tareasPaginadas, total }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
