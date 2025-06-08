import type { APIRoute } from "astro"
import { state } from "./state"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const boardId = formData.get("boardId")?.toString()
  const id = Number(formData.get("id"))
  const action = formData.get("action")
  const board = state.boards.find((b) => b.id === boardId)
  if (!board) {
    return new Response(JSON.stringify({ error: "Tablero no encontrado" }), { status: 404 })
  }
  const task = board.tasks.find((t) => t.id === id)
  if (!task) {
    return new Response(JSON.stringify({ error: "Tarea no encontrada" }), { status: 404 })
  }
  if (action === "toggle") {
    task.completed = !task.completed
  } else if (action === "delete") {
    board.tasks = board.tasks.filter((t) => t.id !== id)
  } else if (action === "edit") {
    const newContent = formData.get("task_content")?.toString()
    if (newContent) task.task_content = newContent
  }
  return new Response(JSON.stringify(board.tasks), { headers: { "Content-Type": "application/json" } })
}