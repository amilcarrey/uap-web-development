import type { APIRoute } from "astro";
import { tableros } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const board = formData.get("board")?.toString() || "default";
  const id = Number(formData.get("id"));

  if (!tableros[board]) {
    return new Response(JSON.stringify({ success: false, error: "Tablero no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tareas = tableros[board];

  if (!isNaN(id) && id >= 0 && id < tareas.length) {
    tareas.splice(id, 1);

    const accept = request.headers.get("Accept") || "";
    const responseJson = JSON.stringify({ success: true });

    if (accept.includes("application/json")) {
      return new Response(responseJson, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const location = new URL("/", request.url);
    return Response.redirect(location.toString(), 303); // Redirección para formularios clásicos
  }

  return new Response(JSON.stringify({ success: false, error: "ID inválido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
