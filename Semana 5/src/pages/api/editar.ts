import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const PUT: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  try {
    const data =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);

    const { id, text, done } = data;
    const taskId = tasks.findIndex(task => task.id === id);

    if (typeof text === "string" && text.trim() !== "") {
      tasks[taskId].text = text.trim();
    }

    if (contentType === "application/json") {
      return new Response(JSON.stringify(tasks[taskId]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return redirect("/");
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};