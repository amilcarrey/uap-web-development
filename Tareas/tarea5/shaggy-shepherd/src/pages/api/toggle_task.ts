import { toggleTask } from '../../server/tasks.ts';
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
    return new Response(JSON.stringify({ error: "Invalid or missing ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const taskExists = toggleTask(id);

  if (!taskExists) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { getTasks } = await import('../../server/tasks.ts');
  const tasks = getTasks();

  return new Response(JSON.stringify({ tasks }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
