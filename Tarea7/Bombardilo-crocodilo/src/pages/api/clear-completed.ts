import type { APIRoute } from "astro"
import { state } from "./state"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const boardId = formData.get("boardId")?.toString()
  const board = state.boards.find((b) => b.id === boardId)
  if (!board) {
    return new Response(JSON.stringify({ error: "Tablero no encontrado" }), { status: 404 })
  }
  board.tasks = board.tasks.filter((t) => !t.completed)
  return new Response(JSON.stringify(board.tasks), { headers: { "Content-Type": "application/json" } })
}