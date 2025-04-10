import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const data = await request.formData();
  const id = Number(data.get("task-id"));
  const tasks = locals.tasks || [];

  if (tasks[id]) tasks[id].done = !tasks[id].done;

  locals.tasks = tasks;
  return redirect("/");
};
