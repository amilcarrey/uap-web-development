import type { APIRoute } from "astro";
import { listarTableros } from "../../lib/tareas";

export const GET: APIRoute = async () => {
  try {
    const tableros = listarTableros();
    
    return new Response(JSON.stringify({ tableros }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener tableros" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};