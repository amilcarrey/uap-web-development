import type { APIRoute } from "astro";
import { getTasks, addTask } from "../../services/Tareas";

export const GET: APIRoute = async ({ request }) => {
  const filter = new URL(request.url).searchParams.get("filter") ?? "all";
  const tasks = getTasks(filter);
  return new Response(JSON.stringify({ tasks }), { status: 200 });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type") || "";
  let taskText: string | null = null;

  if (contentType.includes("application/json")) {
    const data = await request.json();
    taskText = data.task;
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    taskText = form.get("task")?.toString() ?? null;
  }

  if (!taskText) {
    return new Response("Task text is required", { status: 400 });
  }

  const task = addTask(taskText);

  // Si es HTML form, redirigir. Si es JSON, responder normalmente.
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return redirect("/", 302);
  }

  return new Response(JSON.stringify({ task }), { status: 201 });
};
