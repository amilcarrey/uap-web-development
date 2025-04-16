import type { APIRoute } from "astro";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const contentType = request.headers.get("content-Type");
  const tasks = locals.tasks || [];

  try {
    const { id } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);
    
    if (typeof id === "number" && tasks[id]) tasks[id].done = !tasks[id].done

    if (contentType === "application/json") {
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }

    locals.tasks = tasks;

    return redirect("/");
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};
