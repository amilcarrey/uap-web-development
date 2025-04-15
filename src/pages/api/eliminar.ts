import type { APIRoute } from "astro";
import { eliminarTarea } from "../../lib/tareas";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let id: number | null = null;
  let esJSON = false;

  if (contentType.includes("application/json")) {
    esJSON = true;
    try {
      const body = await request.json();
      id = Number(body.id);
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    const formData = await request.formData();
    id = Number(formData.get("id"));
  }

  if (!id) {
    const mensaje = { error: "ID inválido o faltante" };
    return new Response(
      esJSON ? JSON.stringify(mensaje) : "ID inválido o faltante",
      {
        status: 400,
        headers: {
          "Content-Type": esJSON ? "application/json" : "text/plain",
        },
      }
    );
  }

  eliminarTarea(id);

  if (esJSON) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, { status: 302, headers: { Location: "/" } });
};
