import type { APIRoute } from "astro";
import { eliminarCompletadas, listarTareas } from "../../lib/tareas";

// Ruta POST para eliminar las tareas completadas
export const POST: APIRoute = async ({ request }) => {
  const esJSON = request.headers.get("content-type")?.includes("application/json");

  // Elimina las tareas completadas
  eliminarCompletadas();

  // Si se envía una solicitud con contenido JSON, devolvemos la lista de tareas actualizadas
  if (esJSON) {
    const tareasActualizadas = listarTareas(); // Obtenemos las tareas actuales
    return new Response(
      JSON.stringify({ success: true, mensaje: "Tareas completadas eliminadas", tareas: tareasActualizadas }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Si no es JSON vuelvo al inicio
  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
};
