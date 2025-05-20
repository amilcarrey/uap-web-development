import type { APIRoute } from "astro";
import { obtenerTareas } from "../../../lib/tareas";


export const GET: APIRoute = async ({ request, redirect }) => {
  // const search = new URL(request.url).searchParams.get("search");
  const messages = obtenerTareas();

  return new Response(JSON.stringify({ messages }), {
    status: 200,
  });
};
