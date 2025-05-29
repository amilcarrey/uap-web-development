import type { APIRoute } from "astro";
import { actualizarDescripcion } from "../../lib/tareas";

export const PUT: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  const esJSON = contentType.includes("application/json");

  let id: number | null = null;
  let descripcion: string | null = null;

  try {
    const body = await request.json();
    id = Number(body.id);
    descripcion = body.descripcion?.toString() || null;
  } catch (err) {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id || isNaN(id) || !descripcion || descripcion.trim() === "") {
    return new Response(
      JSON.stringify({ error: "Datos inválidos: se requiere id y descripción válida" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const resultado = actualizarDescripcion(id, descripcion);

  if (!resultado) {
    return new Response(JSON.stringify({ error: "No se encontró la tarea" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Tarea actualizada correctamente" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};