// src/pages/api/limpiar.ts
import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  for (let i = tareas.length - 1; i >= 0; i--) {
    if (tareas[i].completada) {
      tareas.splice(i, 1);
    }
  }

  const aceptaHTML = request.headers.get("accept")?.includes("text/html");

  if (aceptaHTML) {
    const location = new URL("/", request.url);
    return Response.redirect(location.toString(), 303);
  }

  //devuelve JSON correctamente para fetch/AJAX
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
