import type { APIRoute } from "astro";
import { state } from "../../../state";

type Action = "add" | "toggle" | "delete" | "clear-completed" | "clear-all" | "edit";

const parseFromJSON = async (request: Request) => {
  const body = await request.json();
  return {
    action: body.action as Action,
    task: body.task?.toString(),
    id: body.id?.toString(),
    mode: body.mode?.toString(),
  };
};

const parseFromFormData = async (request: Request) => {
  const formData = await request.formData();
  return {
    action: formData.get("action")?.toString() as Action,
    task: formData.get("task")?.toString(),
    id: formData.get("id")?.toString(),
    mode: formData.get("mode")?.toString(),
  };
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const contentType = request.headers.get("content-type") || "";
  const { action, task, id, mode } = contentType.includes("application/json")
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
      tablero: mode || params.mode || "personal", 
    });
  } else if (action === "toggle" && id) {
    // SOLO del tablero correcto
    const tarea = state.tareas.find((t) => t.id === id && t.tablero === mode); 
    if (tarea) {
      tarea.completada = !tarea.completada;
    }
  } else if (action === "edit" && id && task) {
    // SOLO del tablero correcto
    const tarea = state.tareas.find((t) => t.id === id && t.tablero === mode);
    if (tarea) {
      tarea.text = task;
      if (tarea.completada) {
        return new Response(JSON.stringify({ error: "No se puede editar una tarea completada" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } else if (action === "delete" && id) {
    // SOLO del tablero correcto
    state.tareas = state.tareas.filter((t) => !(t.id === id && t.tablero === mode));
  } else if (action === "clear-completed") {
    // SOLO del tablero correcto
    state.tareas = state.tareas.filter((t) => !(t.completada && t.tablero === mode));
  } else if (action === "clear-all") {
    // SOLO del tablero correcto
    state.tareas = state.tareas.filter((t) => t.tablero !== mode);
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