
import type { APIRoute } from "astro";
import {
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
} from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  try {
    let accion: string | null = null;
    let texto: string | null = null;
    let id: string | null = null;

    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const body = await request.json();
      accion = body.accion;
      texto = body.texto;
      id = body.id;
    } else if (
      contentType?.includes("multipart/form-data") ||
      contentType?.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      accion = formData.get("accion")?.toString() || null;
      texto = formData.get("texto")?.toString() || null;
      id = formData.get("id")?.toString() || null;
    } else {
      return new Response("Unsupported content type", { status: 400 });
    }

    if (accion === "agregar" && texto) {
      const tarea = agregarTarea(texto);
      return new Response(JSON.stringify({ tarea }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (accion === "borrar" && id) {
      borrarTarea(id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (accion === "toggle" && id) {
      const tarea = toggleTarea(id);
      return new Response(JSON.stringify(tarea), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (accion === "limpiar") {
      limpiarCompletadas();
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Acción inválida", { status: 400 });

  } catch (error) {
    console.error("❌ Error en /api/tareas:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
};
