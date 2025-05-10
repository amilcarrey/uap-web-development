import type { APIRoute } from "astro";
import { agregarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  
  let descripcion: string | null = null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    descripcion = params.get("descripcion");
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    console.log(formData);
    descripcion = formData.get("descripcion")?.toString() || null;
  }

  if (!descripcion) {
    return new Response("Descripción requerida", { status: 400 });
  }

  agregarTarea(descripcion);
  return new Response(null, { status: 302, headers: { Location: "/" } });
};
