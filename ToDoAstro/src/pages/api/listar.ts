import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtro = url.searchParams.get("filtro") ?? "todas";

  let tareasFiltradas = tareas.map((t, i) => ({ ...t, id: i }));

  if (filtro === "completadas" || filtro === "completed") {
    tareasFiltradas = tareasFiltradas.filter(t => t.completada);
  } else if (filtro === "incompletas" || filtro === "incomplete") {
    tareasFiltradas = tareasFiltradas.filter(t => !t.completada);
  }

  return new Response(JSON.stringify(tareasFiltradas), {
    headers: { "Content-Type": "application/json" },
  });
};
