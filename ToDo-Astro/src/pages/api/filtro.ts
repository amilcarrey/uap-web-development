import type { APIRoute } from "astro";
import { listarTareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const { filtro } = await request.json();

  let tareas = listarTareas();

  switch (filtro) {
    case "completadas":
      tareas = tareas.filter((t) => t.completada);
      break;
    case "pendientes":
      tareas = tareas.filter((t) => !t.completada);
      break;
    case "todas":
    default:
      break;
  }

  return new Response(
    JSON.stringify({ tareas }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
