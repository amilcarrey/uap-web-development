import type { APIRoute } from "astro";
import { agregarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";

  let descripcion: string | null = null;
  let esJSON = false;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    descripcion = params.get("descripcion");
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    descripcion = formData.get("descripcion")?.toString() || null;
  } else if (contentType.includes("application/json")) {
    esJSON = true;
    try {
      const json = await request.json();
      descripcion = json.descripcion;
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (!descripcion) {
    const errorMsg = { error: "Descripción requerida" };
    return new Response(
      esJSON ? JSON.stringify(errorMsg) : "Descripción requerida",
      {
        status: 400,
        headers: { "Content-Type": esJSON ? "application/json" : "text/plain" },
      }
    );
  }

  agregarTarea(descripcion);

  if (esJSON) {
    return new Response(
      JSON.stringify({ success: true, mensaje: "Tarea agregada" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(null, { status: 302, headers: { Location: "/" } });
};
