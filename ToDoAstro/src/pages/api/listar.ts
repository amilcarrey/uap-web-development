import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtro = url.searchParams.get("filtro") ?? "todas";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "5", 10);

  let tareasFiltradas = tareas.map((t, i) => ({ ...t, id: i }));

  if (filtro === "completadas") {
    tareasFiltradas = tareasFiltradas.filter((t) => t.completada);
  } else if (filtro === "incompletas") {
    tareasFiltradas = tareasFiltradas.filter((t) => !t.completada);
  }

  const total = tareasFiltradas.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const tareasPaginadas = tareasFiltradas.slice(start, end);

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
