import type { APIRoute } from "astro";
import { agregarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let descripcion: string | null = null;
  const esJSON = contentType.includes("application/json");

  try {
    if (esJSON) {
      const body = await request.json();
      descripcion = body.descripcion?.toString() || null;
    } else {
      const formData = await request.formData();
      descripcion = formData.get("descripcion")?.toString() || null;
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Formato del cuerpo inválido" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!descripcion || descripcion.trim() === "") {
    const error = { error: "Descripción inválida o faltante" };
    return new Response(
      esJSON ? JSON.stringify(error) : "Descripción inválida o faltante",
      {
        status: 400,
        headers: {
          "Content-Type": esJSON ? "application/json" : "text/plain",
        },
      }
    );
  }

const nuevaTarea = agregarTarea(descripcion);

if (!nuevaTarea) {
  return new Response(JSON.stringify({ error: "La tarea ya existe" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

return new Response(JSON.stringify({ success: true, tarea: nuevaTarea }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});


  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
};
