import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas.ts";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const id = Number(data.get("id"));

  if (!isNaN(id) && tareas[id]) {
    tareas[id].completada = !tareas[id].completada;

    const accept = request.headers.get("Accept") || "";
    const responseJson = JSON.stringify({ success: true, completada: tareas[id].completada });

    if (accept.includes("application/json")) {
      return new Response(responseJson, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const location = new URL("/", request.url);
    return Response.redirect(location.toString(), 303); // Para formularios clásicos
    }

  return new Response(JSON.stringify({ success: false, error: "ID inválido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
