import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const texto = formData.get("texto");

  if (!Number.isInteger(id) || typeof texto !== "string" || texto.trim() === "") {
    return new Response(
      JSON.stringify({ success: false, error: "Datos inválidos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (id < 0 || id >= tareas.length) {
    return new Response(
      JSON.stringify({ success: false, error: "Tarea no encontrada" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  tareas[id].texto = texto.trim();

  return new Response(JSON.stringify({ success: true, tarea: { ...tareas[id], id } }), {
    headers: { "Content-Type": "application/json" },
  });
};
