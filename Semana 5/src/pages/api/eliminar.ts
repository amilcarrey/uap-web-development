import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = Number(formData.get("task-id"));

  if (!isNaN(id) && id >= 0 && id < tasks.length) {
    tasks.splice(id, 1); // elimina la tarea por índice
  }

  return redirect("/");
};
