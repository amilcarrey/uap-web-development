import type { APIRoute } from "astro";
import { actualizarEstado } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  actualizarEstado(id);
  return new Response(null, { status: 302, headers: { Location: "/" } });
};
