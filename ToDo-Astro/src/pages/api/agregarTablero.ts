import type { APIRoute } from "astro";
import { agregarTablero } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { nombre, alias } = await request.json();
    
    if (!nombre || !alias) {
      return new Response(JSON.stringify({ error: "Nombre y alias son requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const nuevoTablero = agregarTablero(nombre.trim(), alias.trim());
    
    if (!nuevoTablero) {
      return new Response(JSON.stringify({ error: "El tablero ya existe" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, tablero: nuevoTablero }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al crear tablero" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};