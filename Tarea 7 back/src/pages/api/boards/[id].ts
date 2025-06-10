import type { APIRoute } from "astro";
import { deleteBoard } from "../../../services/boards";
import type { Board } from "../../../types";
import { getBoards } from "../../../services/boards";

export const POST: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response("Board ID is required", { status: 400 });
  }

  try {
    const board = deleteBoard(id); // ya guarda en el archivo
    if (!board) {
      return new Response("Board not found", { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, board }), {
      status: 200,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Error deleting board", { status: 500 });
  }
};


export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response("Board ID is required", { status: 400 });
  }

  const boards = getBoards();
  const board = boards.find((b: Board) => b.id === id);

  if (!board) {
    return new Response("Board not found", { status: 404 });
  }

  return new Response(JSON.stringify(board), {
    status: 200,
  });
};
