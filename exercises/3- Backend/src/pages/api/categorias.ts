import { APIRoute } from "astro";
import { addCategoria, deleteCategoria, listarCategorias, categoriaExiste } from "../../lib/categories";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const categoriaId = url.searchParams.get("categoriaId") || "";

  // Validar si se proporciona un categoriaId y si no existe
  if (categoriaId && !categoriaExiste(categoriaId)) {
    return new Response("Error: La categoría no existe", { status: 404 });
  }

  // Si no se proporciona categoriaId o es válido, devolver todas las categorías
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

  if (method === "ADD_CATEGORIA" && name) {
    addCategoria(name);
  } else if (method === "DELETE_CATEGORIA" && id) {
       if (!categoriaExiste(id)) {
      return new Response("Error: La categoría no existe", { status: 404 });
    }
    deleteCategoria(id);
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  return new Response(JSON.stringify(listarCategorias()), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};