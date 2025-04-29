import type { APIRoute } from "astro";
import { state } from "../../services/state";
import { getTasksFiltered, addTask} from "../../lib/tasks";




export const GET: APIRoute = async ({request}) => {
  
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter");

    let filteredTasks = getTasksFiltered(filter);

    return new Response(JSON.stringify(filteredTasks), {
        headers: {"Content-Type": "application/json"}
    });
};

export const POST: APIRoute = async ({request}) => {
    const data = await request.json();
    if (data.action === "add" && data.name) {
      const newTask = addTask(data.name); 
      
      return new Response(JSON.stringify(newTask), {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(
      JSON.stringify({ error: "Faltan campos para agregar la tarea" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );



}