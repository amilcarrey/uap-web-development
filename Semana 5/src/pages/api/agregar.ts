import type { APIRoute } from "astro";
import { generateId, tasks } from "../../lib/tasks.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  try {
    const data =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);

    const text = data?.text;
    const boardId = data?.activeBoardId;

    if (typeof text === "string" && text.trim() !== "") {
      const validBoardId = typeof boardId === "string" && boardId.trim() !== "" ? boardId.trim() : "general"; // Default to "general" if no boardId is provided
      const newTask = { id: generateId(), text: text.trim(), done: false, activeBoardId: validBoardId };
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
