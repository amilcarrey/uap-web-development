import type { APIContext } from "astro";
import { updateTask, deleteTask } from "../../../db/tasks";

export async function PUT({ params, request }: APIContext) {
  const idStr = params.id;
  if (!idStr) {
    return new Response("Missing ID", { status: 400 });
  }

  const id = parseInt(idStr, 10);
  const updates = await request.json();
  const updated = updateTask(id, updates);
  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }: APIContext) {
  const idStr = params.id;
  if (!idStr) {
    return new Response("Missing ID", { status: 400 });
  }

  const id = parseInt(idStr, 10);
  const ok = deleteTask(id);
  return new Response(null, { status: ok ? 204 : 404 });
}
