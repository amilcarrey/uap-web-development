import type { APIRoute } from "astro";
import { tareas } from "../../../lib/tareas.ts";

export const POST: APIRoute = async ({ request, params }) => {
  const id = Number(params.id);

  if (!isNaN(id) && tareas[id]) {
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
