import { addTask } from '../../server/tasks.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect }) => {
  console.log("POST request received in add_task.ts");

  const contentType = request.headers.get("Content-Type") || "";

  let data: { text: string };
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const body = await request.formData();
    data = Object.fromEntries(body.entries()) as { text: string };
  }

  const text = data.text?.trim();
  if (!text) {
    return new Response(
      JSON.stringify({ success: false, message: "Task text cannot be empty" }),
      { status: 400 }
    );
  }

  const newTask = addTask(text);

  if (contentType.includes("application/json")) {
    return new Response(
      JSON.stringify({ success: true, task: newTask }),
      { status: 200 }
    );
  }

  return redirect("/");
};
