import type { APIRoute } from "astro";
import { completeTask, deleteTask } from "../../../services/tasks";

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const { id } = params;
  const formData = await request.formData();
  const action = formData.get("action");

  if (!id) {
    return new Response("Task ID is required", { status: 400 });
  }

  if (!action) {
    return new Response("Action is required", { status: 400 });
  }

  if (action === "complete") {
    await completeTask(id);
  } else if (action === "delete") {
    await deleteTask(id);
  }

  return redirect("/");
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Task ID is required"}), {
      status: 400,
    });
  }

  await deleteTask(id);

  return new Response(JSON.stringify({ success: true }), { status: 200,});
};

export const PUT: APIRoute = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Task ID is required"}), {
      status: 400,
    });
  }
  
  const task = await completeTask(id);

  return new Response(JSON.stringify({ task }), { status: 200 });
};
