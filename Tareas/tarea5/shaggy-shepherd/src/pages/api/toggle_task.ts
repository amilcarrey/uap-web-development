import { toggleTask } from '../../server/tasks.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, url, redirect }) => {
  const idParam = url.searchParams.get("id");
  const id = Number(idParam);

  if (!idParam || isNaN(id)) {
    return new Response("Invalid or missing ID", { status: 400 });
  }

  const taskExists = toggleTask(id);

  if (!taskExists) {
    return new Response("Task not found", { status: 404 });
  }

  return redirect("/");
};
