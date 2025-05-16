import type { APIRoute } from "astro";
import { eliminarCompletadas, listarTareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const esJSON = request.headers.get("content-type")?.includes("application/json");

  // Eliminar y obtener IDs eliminados
  const idsEliminados = eliminarCompletadas();

  // Obtener la nueva lista de tareas
  const tareasActualizadas = listarTareas();

  return new Response(
    JSON.stringify({
      success: true,
      mensaje: "Tareas completadas eliminadas",
      tareas: tareasActualizadas,
      ids: idsEliminados,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
