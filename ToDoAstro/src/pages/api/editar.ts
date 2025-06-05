import type { APIRoute } from "astro";
import { tableros } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const texto = formData.get("texto")?.toString().trim();
  const board = formData.get("board")?.toString() || "default";

  if (!tableros[board]) {
    return new Response(
      JSON.stringify({ success: false, error: "Tablero no encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!Number.isInteger(id) || !texto) {
    return new Response(
      JSON.stringify({ success: false, error: "Datos inválidos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const tareas = tableros[board];

  if (id < 0 || id >= tareas.length) {
    return new Response(
      JSON.stringify({ success: false, error: "Tarea no encontrada" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  tareas[id].texto = texto;

  return new Response(
    JSON.stringify({ success: true, tarea: { ...tareas[id], id } }), 
    {
    headers: { "Content-Type": "application/json" }, }
  );
};
