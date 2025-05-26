import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const GET: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "all"; // Obtiene el filtro de la URL, por defecto es "all"

  const allTasks = tasks; // Agrega un ID a cada tarea
  let filteredTasks = allTasks; // Inicializa filteredTasks con todas las tareas

  try {
    if (filter === "completed") {
      filteredTasks = allTasks.filter((task) => task.done); // Filtra las tareas completadas
    }
    else if (filter === "incomplete") {
      filteredTasks = allTasks.filter((task) => !task.done); // Filtra las tareas incompletas
    }

    if (contentType === "application/json") {
      return new Response(JSON.stringify(filteredTasks), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }
    
    return redirect("/");

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }

};
