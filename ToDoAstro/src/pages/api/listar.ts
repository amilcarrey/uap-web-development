import type { APIRoute } from "astro";
import { tableros } from "../../lib/tareas";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const board = url.searchParams.get("board") ?? "default";
  const filtro = url.searchParams.get("filtro") ?? "todas";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "5", 10);

   if (!tableros[board]) {
    tableros[board] = [];
  }
  
  let tareas = tableros[board].map((t, i) => ({ ...t, id: i }));

  if (filtro === "completadas") {
    tareas = tareas.filter((t) => t.completada);
  } else if (filtro === "incompletas") {
    tareas = tareas.filter((t) => !t.completada);
  }

  const total = tareas.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const tareasPaginadas = tareas.slice(start, end);

  return new Response(
    JSON.stringify({
      tareas: tareasPaginadas,
      total,
      page,
      totalPages,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
