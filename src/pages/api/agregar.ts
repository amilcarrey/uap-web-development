import type { APIRoute } from "astro";
import { agregarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let descripcion: string | null = null;
  let esJSON = false;

  // Detectar si el contenido es JSON
  if (contentType.includes("application/json")) {
    esJSON = true;
    try {
      const body = await request.json();
      descripcion = body.descripcion;
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    // Si es FormData, tomar la descripción del formulario
    const formData = await request.formData();
    descripcion = formData.get("descripcion")?.toString() || null;
  }

  // Validación de la descripción
  if (!descripcion) {
    const mensaje = { error: "Descripción inválida o faltante" };
    return new Response(
      esJSON ? JSON.stringify(mensaje) : "Descripción inválida o faltante",
      {
        status: 400,
        headers: {
          "Content-Type": esJSON ? "application/json" : "text/plain",
        },
      }
    );
  }

  // Agregar la nueva tarea
  const nuevaTarea = agregarTarea(descripcion);

  // Respuesta en formato JSON
  if (esJSON) {
    return new Response(JSON.stringify({ success: true, tarea: nuevaTarea }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Redirigir si es un formulario
  return new Response(null, { status: 302, headers: { Location: "/" } });
};
