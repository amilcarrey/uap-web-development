import type { APIRoute } from "astro";
import { eliminarCompletadas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const esJSON = request.headers.get("content-type")?.includes("application/json");

  eliminarCompletadas();

  if (esJSON) {
    return new Response(
      JSON.stringify({ success: true, mensaje: "Tareas completadas eliminadas" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(null, { status: 302, headers: { Location: "/" } });
};
