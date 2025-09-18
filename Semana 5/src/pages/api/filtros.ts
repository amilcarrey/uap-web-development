import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const GET: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "all"; // Obtiene el filtro de la URL, por defecto es "all"
  const activeBoardId = url.searchParams.get("activeBoardId"); // Obtiene el ID del tablero de la URL
  console.log("Board ID:", activeBoardId);
  console.log("request URL:", request.url);
  console.log("query params:", [...url.searchParams.entries()]);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10); // Obtiene el número de página, por defecto es 1
  const limit = parseInt(url.searchParams.get("limit") ?? "5", 10); // Obtiene el límite de tareas por página, por defecto es 5

  const allTasks = tasks; // Agrega un ID a cada tarea

  // Priemero filtra las tareas por el ID del tablero
  let filteredTasks = allTasks.filter((task) => task.activeBoardId === activeBoardId); // Inicializa filteredTasks con todas las tareas

  try {
    if (filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.done); // Filtra las tareas completadas
    }
    else if (filter === "incomplete") {
      filteredTasks = filteredTasks.filter((task) => !task.done); // Filtra las tareas incompletas
    }

    // Paginación
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTasks = filteredTasks.slice(start, end);

    if (contentType === "application/json") {
      return new Response(
        JSON.stringify({
          tasks: paginatedTasks,
          total: filteredTasks.length
        }), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }
    
    return redirect("/");

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }

};
