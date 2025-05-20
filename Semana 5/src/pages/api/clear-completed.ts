import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const filteredTasks = tasks.filter(task => !task.done);
    tasks.splice(0, tasks.length, ...filteredTasks); // Reemplaza el contenido de tasks con las tareas no completadas
    
    if (contentType === "application/json") {
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }
    
    return redirect("/");

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }

};
