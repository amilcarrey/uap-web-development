import type { APIRoute } from "astro";
import { listarTareas } from "../../lib/tareas";

export const GET: APIRoute = async ({ url }) => {
  const filtro = url.searchParams.get("filtro") as "completadas" | "pendientes" | null;
  const tareas = listarTareas(filtro || undefined);

  return new Response(JSON.stringify(tareas), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
