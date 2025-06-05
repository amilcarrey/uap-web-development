import type { APIRoute } from "astro";
import { tableros } from "../../../lib/tareas";

export const POST: APIRoute = async ({ request, params }) => {
  const id = Number(params.id);
  const formData = await request.formData();
  const board = request.headers.get("board") || "default";

  if (!tableros[board]) {
    return new Response(JSON.stringify({ success: false, error: "Tablero no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tareas = tableros[board];

  if (!isNaN(id) && id > 0 && id < tareas.length) {
    tareas[id].completada = !tareas[id].completada;

    const aceptaHTML = request.headers.get("accept")?.includes("text/html");

    if (aceptaHTML) {
      const location = new URL("/", request.url);
      return Response.redirect(location.toString(), 303); // Redirección para formularios clásicos
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: false, error: "ID inválido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
