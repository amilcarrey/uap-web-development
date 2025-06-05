import type { APIRoute } from "astro";
import { state } from "./state";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const action = formData.get("action");

  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    return new Response(JSON.stringify({ error: "Tarea no encontrada" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "toggle") {
    task.completed = !task.completed;
  } else if (action === "delete") {
    state.tasks = state.tasks.filter((t) => t.id !== id);
  } else if (action === "edit") {
    const newContent = formData.get("task_content");
    if (typeof newContent === "string" && newContent.trim() !== "") {
      task.task_content = newContent.trim();
    } else {
      return new Response(JSON.stringify({ error: "Contenido inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify(state.tasks), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
