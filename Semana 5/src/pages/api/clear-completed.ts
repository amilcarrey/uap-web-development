import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const data =
      contentType === "application/x-www-form-urlencoded"
        ? Object.fromEntries(await request.formData())
        : await parseJson(request);

    const boardId = data.boardId;
    
    const filteredTasks = tasks.filter((task) => !(task.done && task.boardId === boardId)); // Filtra las tareas completadas del tablero específico
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
