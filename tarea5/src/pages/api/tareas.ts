import type { APIRoute } from "astro";
import { addTarea, getTareas, completeTarea, deleteTarea, deleteTareasCompletadas } from "../../services/tareas";
import type { Tarea } from "../../type";

export const GET: APIRoute = async ({ request }) => {
  const buscar = new URL(request.url).searchParams.get("search");
  const tareas = getTareas(buscar ?? "");
  return new Response(JSON.stringify({ tareas }), {
    status: 200,
  });
};

const parseFormData = (formData: FormData) => {
  const contenido = formData.get("content")?.toString();
  const id = formData.get("id")?.toString();
  const _method = formData.get("_method")?.toString();
  return { contenido, id, _method };
};

const parseJson = (json: { content?: string; id?: string; _method?: string }) => {
  return { contenido: json.content, id: json.id, _method: json._method };
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");
  const { contenido, id, _method } = 
    contentType === "application/json"
      ? parseJson(await request.json())
      : parseFormData(await request.formData());

  if (_method === "toggle" && id) {
    const tarea = completeTarea(id);
    if (!tarea) {
      return new Response("Tarea no encontrada", { status: 404 });
    }
    return new Response(JSON.stringify({ tarea }), { status: 200 });
  }

  if (_method === "delete" && id) {
    const tarea = deleteTarea(id);
    if (!tarea) {
      return new Response("Tarea no encontrada", { status: 404 });
    }
    return new Response(JSON.stringify({ tarea }), { status: 200 });
  }

  if (_method === "delete-completadas") {
    deleteTareasCompletadas();
    return new Response(null, { status: 204 });
  }

  if (!contenido) {
    return new Response("Content is required", { status: 400 });
  }

  const tarea = addTarea(contenido);
  return new Response(JSON.stringify({ tarea }), {
    status: 201,
  });
};