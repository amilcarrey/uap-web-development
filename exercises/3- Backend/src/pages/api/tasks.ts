export const prerender = false;
import { APIRoute } from "astro";
import {
  addTask,
  deleteTask,
  toggleTaskCompletion,
  deleteCompletedTasks,
  listarTareas,
} from "../../lib/tasks";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtro = url.searchParams.get("filtro") as "completadas" | "pendientes" | null;

  const tareas = listarTareas(filtro ?? undefined);

  return new Response(JSON.stringify(tareas), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  const acceptHeader = request.headers.get("accept") || "";
  const isJsonRequest = acceptHeader.includes("application/json");

  let method: string | null = null;
  let text: string | null = null;
  let id: number | null = null;

  // Lectura del body según tipo
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    method = params.get("_method");
    text = params.get("text");
    id = params.get("id") ? Number(params.get("id")) : null;
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    method = formData.get("_method")?.toString() || null;
    text = formData.get("text")?.toString() || null;
    const idStr = formData.get("id");
    id = idStr ? Number(idStr) : null;
  } else if (contentType.includes("application/json")) {
    const json = await request.json();
    method = json._method || null;
    text = json.text || null;
    id = json.id !== undefined ? Number(json.id) : null;
  } else {
    return new Response("Unsupported Content-Type", { status: 400 });
  }

  // Acciones
  if (method === "DELETE" && id !== null) {
    deleteTask(id);
  } else if (method === "TOGGLE" && id !== null) {
    toggleTaskCompletion(id);
  } else if (method === "DELETE_COMPLETED") {
    deleteCompletedTasks();
    if (isJsonRequest) {
      return new Response(JSON.stringify(listarTareas()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null, { status: 303, headers: { Location: "/" } });
    }
  } else if (method === "ADD" && text) {
    addTask(text);
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  // Respuesta final: JSON si es SPA, redirigir si es form
  if (isJsonRequest) {
    return new Response(JSON.stringify(listarTareas()), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(null, { status: 303, headers: { Location: "/" } });
  }
};
