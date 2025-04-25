import type { APIRoute } from "astro";
import { tasks } from "../../types.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const { text } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);
    
    const filter = Astro.url.searchParams.get("filter") ?? "all";
    let filteredTasks = tasks
    if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.done);

        if (typeof id === "number" && !isNaN(id) && id >= 0 && id < tasks.length) {
      tasks.splice(id, 1); // elimina la tarea por índice
    }
      
    
      if (contentType === "application/json") {
        return new Response(JSON.stringify(newTask), {
          status: 200,
          headers: { "Content-Type": "application/json"},
        });
      }

      return redirect("/");
    }
    
    return new Response("Invalid task text", { status: 400 });

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }

};
