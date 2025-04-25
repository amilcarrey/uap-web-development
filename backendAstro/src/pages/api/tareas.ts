import type { APIRoute } from "astro";
import {
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
} from "../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { accion, texto, id } = await request.json();

    if (accion === "agregar") {
      const tarea = agregarTarea(texto);
      return json({ tarea });
    }

    if (accion === "borrar") {
      borrarTarea(id);
      return json({ ok: true });
    }

    if (accion === "toggle") {
      toggleTarea(id);
      return json({ ok: true });
    }

    if (accion === "limpiar") {
      limpiarCompletadas();
      return json({ ok: true });
    }

    return json({ error: "Acción no reconocida" }, 400);

  } catch (error) {
    console.error("❌ Error en /api/tareas:", error);
    return json({ error: "Error de servidor" }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
