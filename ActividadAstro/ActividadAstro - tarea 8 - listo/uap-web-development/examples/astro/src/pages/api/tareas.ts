import type { APIRoute } from "astro";
import { state } from "../../state";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url, "http://localhost");
  const filter = url.searchParams.get("filter");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "5");
  const mode = url.searchParams.get("mode") || "personal"; // Nuevo: obtener el modo

  let tasks = state.tareas.filter(task => task.tablero === mode); // Filtrar por modo

  // Filtrar por estado
  if (filter === "active") {
    tasks = tasks.filter(task => !task.completada);
  } else if (filter === "completed") {
    tasks = tasks.filter(task => task.completada);
  }

  const total = tasks.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = tasks.slice(start, end);

  return new Response(JSON.stringify({
    tasks: paginated,
    total,
    totalPages,
    currentPage: page,
  }), {
    headers: { "Content-Type": "application/json" },
  });
};
