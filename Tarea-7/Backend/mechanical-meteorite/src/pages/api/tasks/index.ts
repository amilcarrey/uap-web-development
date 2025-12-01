import type { APIRoute } from "astro";
import { getTasks, addTask } from "../../../db/tasks";

export const GET: APIRoute = async ({ url }) => {
  const boardId = url.searchParams.get("board") || "default";
  const tasks = getTasks(boardId);
  return new Response(JSON.stringify(tasks), {
    headers: { "Content-Type": "application/json" }
  });
};

export const POST: APIRoute = async ({ request, url }) => {
  const boardId = url.searchParams.get("board") || "default";
  try {
    const { text } = await request.json();
    const task = addTask(boardId, text);
    return new Response(JSON.stringify(task), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al agregar tarea" }), {
      status: 400
    });
  }
};
