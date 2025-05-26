import type { APIRoute } from "astro";
import { generateId, tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  try {
    const { text } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);
    
    if (typeof text === "string" && text.trim() !== "") {
      const newTask = { id: generateId(), text: text.trim(), done: false };
      tasks.push(newTask);
    
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
