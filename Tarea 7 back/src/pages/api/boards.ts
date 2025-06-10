import type { APIRoute } from "astro";
import { getBoards, addBoard } from "../../services/boards";

export const GET: APIRoute = async () => {
  const boards = getBoards();

  return new Response(JSON.stringify({ boards }), {
    status: 200,
  });
};

const parseFormData = (formData: FormData) => {
  const name = formData.get("name")?.toString();
  return name;
};

const parseJson = (json: { name: string }) => {
  return json.name;
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type");
  const name =
    contentType === "application/json"
      ? parseJson(await request.json())
      : parseFormData(await request.formData());

  if (!name) {
    return new Response("Board name is required", { status: 400 });
  }

  const board = addBoard(name);

  return new Response(JSON.stringify({ board }), {
    status: 201,
  });
};
