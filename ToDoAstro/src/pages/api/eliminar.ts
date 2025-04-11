import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

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

    return Response.redirect("/", 303); // Redirección para formularios clásicos
  }

  return new Response(JSON.stringify({ success: false, error: "ID inválido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
