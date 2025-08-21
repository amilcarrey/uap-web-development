import type { APIRoute } from "astro";
import { boards } from "../../lib/boards.ts";
import { parseFormData, parseJson } from "../../lib/requestParse.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    const data =
      contentType === "application/x-www-form-urlencoded"
        ? await parseFormData(request)
        : await parseJson(request);

    const boardId = data.id;

    const filtered = boards.filter(board => board.id !== boardId);
    boards.splice(0, boards.length, ...filtered);

    if (contentType === "application/json") {
      return new Response(JSON.stringify(boards), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return redirect("/");
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};