import { APIRoute } from "astro";
import { addCategoria, deleteCategoria, listarCategorias } from "../../lib/categories";

export const GET: APIRoute = async () => {
  const categorias = listarCategorias();
  return new Response(JSON.stringify(categorias), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  const isJsonRequest = contentType.includes("application/json");

  let method: string | null = null;
  let name: string | null = null;
  let id: string | null = null;

  if (isJsonRequest) {
    const json = await request.json();
    method = json._method || null;
    name = json.name || null;
    id = json.id || null;
  } else {
    return new Response("Unsupported Content-Type", { status: 400 });
  }

  if (method === "ADD" && name) {
    addCategoria(name);
  } else if (method === "DELETE" && id) {
    deleteCategoria(id);
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  return new Response(JSON.stringify(listarCategorias()), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};