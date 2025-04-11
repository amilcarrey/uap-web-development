import type { APIRoute } from "astro";
import { tareas } from "../../../lib/tareas.ts";

export const POST: APIRoute = async ({ request, params }) => {
  const id = Number(params.id);

  if (!isNaN(id) && tareas[id]) {
    tareas[id].completada = !tareas[id].completada;

    const aceptaHTML = request.headers.get("accept")?.includes("text/html");

    if (aceptaHTML) {
      return Response.redirect("/", 303);
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
