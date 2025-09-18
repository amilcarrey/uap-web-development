import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const data  =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);
    
    const id = String(data.id);
    const task = tasks.find((task) => task.id === id);
    if (task) task.done = !task.done;

    // locals.tasks = tasks;
    
    if (contentType === "application/json") {
      return new Response(JSON.stringify({ success: true, task}), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }

    return redirect("/");
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};
