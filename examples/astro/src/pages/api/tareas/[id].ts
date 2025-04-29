import type { APIRoute } from "astro";
import { state } from "../../../state"; 

type Action = "add" | "toggle" | "delete" | "clear-completed" | "clear-all";

const parseFromJSON = async (request: Request) => {
  const body = await request.json();
  return { action: body.action as Action, task: body.task, id: body.id };
};

const parseFromFormData = async (request: Request) => {
  const formData = await request.formData();
  return {
    action: formData.get("action")?.toString() as Action,
    task: formData.get("task")?.toString(),
    id: formData.get("id")?.toString(),
  };
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const contentType = request.headers.get("content-type") || "";
  const { action, task, id } = contentType.includes("application/json")
    ? await parseFromJSON(request)
    : await parseFromFormData(request);

  if (!action) {
    return new Response("Action is required", { status: 400 });
  }

  if (action === "add" && task) {
    state.tareas.push({
      id: Date.now().toString(),
      text: task,
      completada: false,
      mode: params.mode || "personal",
    });
  } else if (action === "toggle" && id) {
    const tarea = state.tareas.find((t) => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
  } else if (action === "delete" && id) {
    state.tareas = state.tareas.filter((t)  => t.id !== id);
  } else if (action === "clear-completed") {
    state.tareas = state.tareas.filter((t) => !t.completada);
  } else if (action === "clear-all") {
    state.tareas = [];
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  if (contentType.includes("application/json")) {
    return new Response(JSON.stringify({ success: true, tareas: state.tareas }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/?filter=all"); 
};
