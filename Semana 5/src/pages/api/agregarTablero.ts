import type { APIRoute } from "astro";
import { generateId, boards } from "../../lib/boards.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  try {
    const { text } =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);

    if (typeof text === "string" && text.trim() !== "") {
      const newBoard = { id: generateId(), name: text.trim() };
      boards.push(newBoard);

      if (contentType === "application/json") {
        return new Response(JSON.stringify(newBoard), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return redirect("/");
    }

    return new Response("Invalid board name", { status: 400 });

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};
