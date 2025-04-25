import type { APIRoute } from "astro";
import { getTareas } from "../lib/tareas"; // Ajustá el path si cambia

export const GET: APIRoute = async () => {
  const tareas = getTareas();
  return new Response(JSON.stringify(tareas), {
    headers: { "Content-Type": "application/json" },
  });
};
