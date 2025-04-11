import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  // Elimina todas las tareas completadas
  for (let i = tareas.length - 1; i >= 0; i--) {
    if (tareas[i].completada) {
      tareas.splice(i, 1);
    }
  }

  const aceptaHTML = request.headers.get("accept")?.includes("text/html");

  // Si viene de un formulario clásico, redirige
  if (aceptaHTML) {
    return Response.redirect("/", 303);
  }

  // Si viene de fetch/AJAX, devuelve 200 OK sin redirigir
  return new Response(null, { status: 200 });
};
