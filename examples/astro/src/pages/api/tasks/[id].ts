import type { APIRoute } from "astro";
import { updateTask, deleteTask } from "../../../services/Tareas";

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const id = Number(params.id);
  const contentType = request.headers.get("content-type") || "";
  let action: string | null = null;

  if (contentType.includes("application/json")) {
    const data = await request.json();
    action = data.action;
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    action = form.get("action")?.toString() ?? null;
  }

  if (!id || !action) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  if (action === "complete") {
    const task = updateTask(id);
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return redirect("/", 302);
    }
    return new Response(JSON.stringify({ success: true, task }), { status: 200 });
  }

  if (action === "delete") {
    deleteTask(id);
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return redirect("/", 302);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
};
