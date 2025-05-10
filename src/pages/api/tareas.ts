import type { APIRoute } from "astro";
import { listarTareas } from "../../lib/tareas";

export const GET: APIRoute = async () => {
  const tareas = await listarTareas();
  return new Response(JSON.stringify(tareas), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
