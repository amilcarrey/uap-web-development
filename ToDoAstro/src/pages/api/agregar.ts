import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const texto = formData.get("texto");

  if (typeof texto === "string" && texto.trim() !== "") {
    const nuevaTarea = { texto: texto.trim(), completada: false };
    tareas.push(nuevaTarea);

    const aceptaHTML = request.headers.get("accept")?.includes("text/html");

    if (aceptaHTML) {
      // Si viene de un form clásico, redirige
      const location = new URL("/", request.url);
      return Response.redirect(location.toString(), 303); 
    }

    // Si viene de fetch/AJAX, devuelve JSON
    return new Response(JSON.stringify({ success: true, tarea: nuevaTarea }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: false, error: "Texto vacío" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};