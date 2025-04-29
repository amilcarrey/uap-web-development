import type { APIRoute } from "astro";
import { completeTarea, deleteTarea } from "../../../services/tareas";
import type { Tarea } from "../../../type";

type Action = "complete" | "delete";

const parseFromJSON = (data: { action?: Action }) => {
  return data.action;
};

const parseFromFormData = (formData: FormData) => {
  return formData.get("action")?.toString() as Action | undefined;
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const { id } = params;
  const contentType = request.headers.get("content-type");

  const action = 
    contentType === "application/json"
      ? parseFromJSON(await request.json())
      : parseFromFormData(await request.formData());

  if (!action) {
    return new Response("Action is required", { status: 400 });
  }

  if (!id) {
    return new Response("Id is required", { status: 404 });
  }

  let tarea: Tarea | null = null;

  try {
    if (action === "complete") {
      tarea = completeTarea(id);
    } else if (action === "delete") {
      tarea = deleteTarea(id);
    }
  } catch (error) {
    return new Response("Error", { status: 404 });
  }

  if (!tarea) {
    return new Response("Tarea no encontrada", { status: 404 });
  }

  return redirect("/");
};