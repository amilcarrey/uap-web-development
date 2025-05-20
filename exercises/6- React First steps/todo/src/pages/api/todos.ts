import type { APIRoute } from "astro"; 
import { addTodo, clearCompletedTodos, getFilteredTodos } from '../../services/todos'; // Importa las funciones de servicio para manejar las tareas

export let filter = "all";

const parseFormData = async (request: Request) => {
    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const text = formData.get("text")?.toString();
    const filter = formData.get("filter")?.toString();
    return { action, text, filter };	
};

const parseJson = async (
  request: Request
  ): Promise<{ action: string | undefined; text: string | undefined; filter: string | undefined }> => {
    return await request.json();
  };

export const GET: APIRoute = async ({ request, redirect }) => {
  var contentType = request.headers.get("content-type");

  try {

    const url = new URL(request.url); // Se obtiene la URL del request
    filter = url.searchParams.get("filter") || "all"; // Se obtiene el filtro de la URL

    const filteredTodos = getFilteredTodos(filter); // Se obtienen las tareas filtradas según el estado actual del filtro

    if (contentType === "application/json") {
      
      return new Response(JSON.stringify(filteredTodos), {
        status: 200,
        headers: { "Content-Type": "application/json" } 
      });
    } else {
      console.log("FETCHING JSON");
      return new Response("Redirecting...", { status: 302, headers: { Location: `/?filter=${filter}` } });
    }
  } catch (error) {
    console.error("Error parsing request:", error); // Manejo de errores
    return new Response("Error parsing request", { status: 500 });
  }

  return new Response("Invalid action", { status: 400 });
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
  var contentType = request.headers.get("content-type");
  console.log(contentType);

  try {
    
    const { action, text } = 
    contentType === "application/x-www-form-urlencoded" ?
        await parseFormData(request) :
        await parseJson(request);  

    console.log("action: ", action)
    // console.log("text: ", text)
    // console.log("id: ", id)

    if (action === "add" && text) {
      console.log("AÑADIR")
      addTodo(text); // Añade una nueva tarea al array de tareas
    } else if (action === "clearCompleted") {
      console.log("BORRAR COMPLETADAS")
      clearCompletedTodos(); // Elimina las tareas completadas del array de tareas
    }

  } catch (error) {
    console.error("Error parsing request:", error); // Manejo de errores
  }

  if (contentType === "application/x-www-form-urlencoded") {
    console.log("REDIRECTING")
    return redirect(`/?filter=${filter}`); // Redirige a la página de backend
  }
  if (contentType === "application/json") {
    console.log("JSON");
    return new Response(JSON.stringify(getFilteredTodos(filter)), { 
      status: 200,
    headers: { "Content-Type": "application/json" } }); // Devuelve el array de tareas en formato JSON

  }

  return new Response("Invalid content type", { status: 400 }); // Manejo de errores
};