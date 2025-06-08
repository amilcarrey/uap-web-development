import type { APIRoute } from "astro"
import { state } from "./state"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const boardId = formData.get("boardId")?.toString()
  const task_content = formData.get("task")?.toString() || ""
  const board = state.boards.find((b) => b.id === boardId)
  if (!board) {
    return new Response(JSON.stringify({ error: "Tablero no encontrado" }), { status: 404 })
  }
  board.tasks.push({
    id: board.nextTaskId++,
    task_content,
    completed: false,
  })
  return new Response(JSON.stringify(board.tasks), { headers: { "Content-Type": "application/json" } })
}