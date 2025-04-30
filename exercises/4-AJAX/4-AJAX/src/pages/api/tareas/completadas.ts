import type { APIRoute } from "astro";
import { eliminarTareasCompletadas } from "../../../services/tareas";

export const DELETE: APIRoute = async () => {
  const eliminadas = eliminarTareasCompletadas();
  return new Response(JSON.stringify({ eliminadas }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
