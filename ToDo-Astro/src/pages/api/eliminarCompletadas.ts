import type { APIRoute } from "astro";
import { eliminarCompletadas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { idTablero } = await request.json();
    
    if (!idTablero) {
      return new Response(JSON.stringify({ error: "idTablero es requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const idsEliminados = eliminarCompletadas();

    return new Response(JSON.stringify({
      success: true,
      mensaje: "Tareas completadas eliminadas",
      idsEliminados,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al eliminar tareas completadas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
