import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const texto = formData.get("texto");

  if (typeof texto === "string" && texto.trim() !== "") {
    // Generar ID único incremental
    const nuevoId = tareas.length > 0
      ? Math.max(...tareas.map(t => t.id)) + 1
      : 0;

    const nuevaTarea = {
      id: nuevoId,
      texto: texto.trim(),
      completada: false,
    };

    tareas.push(nuevaTarea);

    const aceptaHTML = request.headers.get("accept")?.includes("text/html");

    if (aceptaHTML) {
      const location = new URL("/", request.url);
      return Response.redirect(location.toString(), 303);
    }

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
