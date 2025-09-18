import { deleteTask, getTasks } from '../../server/tasks.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("Content-Type") || "";

  let id: number | null = null;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    id = Number(body.id);
  } else {
    const form = await request.formData();
    id = Number(form.get("id"));
  }

  if (!id || isNaN(id)) {
    return new Response("Invalid or missing ID", { status: 400 });
  }

  const success = deleteTask(id);

  if (!success) {
    return new Response("Task not found", { status: 404 });
  }

  return new Response(JSON.stringify({ tasks: getTasks() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
