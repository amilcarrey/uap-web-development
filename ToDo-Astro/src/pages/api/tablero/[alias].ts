import type { APIRoute } from "astro";
import { obtenerTablero } from "../../../lib/tareas";

export const GET: APIRoute = async ({ params }) => {
  const { alias } = params;
  
  if (!alias) {
    return new Response(JSON.stringify({ error: "Alias requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tablero = obtenerTablero(alias);
    
    if (!tablero) {
      return new Response(JSON.stringify({ error: "Tablero no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ tablero }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener tablero" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};