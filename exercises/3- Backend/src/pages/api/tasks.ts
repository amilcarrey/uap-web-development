export const prerender = false;
import { APIRoute } from "astro";
import {
  addTask,
  deleteTask,
  toggleTaskCompletion,
  deleteCompletedTasks,
  listarTareas,
  listarTareasPaginadas,
  editTask,
} from "../../lib/tasks";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtro = url.searchParams.get("filtro") as "completadas" | "pendientes" | null;
  const categoriaId = url.searchParams.get("categoriaId") || "";
  const page = parseInt(url.searchParams.get("page")!, 10); // Asume que siempre se envía
  const pageSize = parseInt(url.searchParams.get("pageSize")!, 10); // Asume que siempre se envía

  const result = listarTareasPaginadas(page, pageSize, categoriaId, filtro ?? undefined);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};


export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  const isJsonRequest = contentType.includes("application/json");

  let method: string | null = null;
  let text: string | null = null;
  let id: number | null = null;
  let categoriaId: string ;

  if (isJsonRequest) {
    const json = await request.json();
    method = json._method || null;
    text = json.text || null;
    id = json.id !== undefined ? Number(json.id) : null;
    categoriaId = json.categoriaId || null;
  } else {
    return new Response("Unsupported Content-Type", { status: 400 });
  }

  if (method === "ADD" && text && categoriaId) {
    addTask(text, categoriaId);
  } else if (method === "DELETE" && id !== null) {
    deleteTask(id, categoriaId || "");
  } else if (method === "TOGGLE" && id !== null) {
    toggleTaskCompletion(id, categoriaId || "");
  } else if (method === "DELETE_COMPLETED" && categoriaId) {

    deleteCompletedTasks(categoriaId);
  } else if (method === "EDIT" && id !== null && text && categoriaId) {
    editTask(id, text, categoriaId);
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  return new Response(JSON.stringify(listarTareasPaginadas(1, 10, categoriaId)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

