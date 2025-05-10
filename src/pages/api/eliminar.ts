import type { APIRoute } from "astro";
import { eliminarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  eliminarTarea(id);
  return new Response(null, { status: 302, headers: { Location: "/" } });
};
