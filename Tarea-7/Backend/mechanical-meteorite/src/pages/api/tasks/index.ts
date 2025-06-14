import type { APIRoute } from "astro";
import { getTasks, addTask } from "../../../db/tasks";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(getTasks()), {
    headers: { "Content-Type": "application/json" }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text } = await request.json();
    const newTask = addTask(text);
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al agregar tarea" }), {
      status: 400
    });
  }
};
