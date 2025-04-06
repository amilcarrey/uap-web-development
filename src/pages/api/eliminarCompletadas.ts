import type { APIRoute } from "astro";
import { eliminarCompletadas } from "../../lib/tareas";

export const POST: APIRoute = async () => {
    eliminarCompletadas();
    return new Response(null, { status: 302, headers: { Location: "/" } });
  };