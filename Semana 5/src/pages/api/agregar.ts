import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const { text } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);
    
    if (typeof text === "string" && text.trim() !== "") {
      tasks.push({ text: text.trim(), done: false });
    }

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
