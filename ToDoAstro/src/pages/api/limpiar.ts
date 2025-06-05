// src/pages/api/limpiar.ts
import type { APIRoute } from "astro";
import { tableros } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const board = formData.get("board")?.toString() || "default";
  
  if (!tableros[board]) {
      return new Response(
        JSON.stringify({ success: false, error: "Tablero no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
  }

  const tareas = tableros[board];

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

  //devuelve JOSN para fetch/AJAX
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
