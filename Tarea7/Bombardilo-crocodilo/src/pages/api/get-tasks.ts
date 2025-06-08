import type { APIRoute } from "astro"
import { state } from "./state"

export const GET: APIRoute = ({ url }) => {
  const boardId = url.searchParams.get("boardId")
  const filter = url.searchParams.get("filter")
  const page = Number(url.searchParams.get("page") ?? "1")
  const limit = Number(url.searchParams.get("limit") ?? "5")

  const board = state.boards.find((b) => b.id === boardId)
  if (!board) {
    return new Response(JSON.stringify({ error: "Tablero no encontrado" }), { status: 404 })
  }

  let filtered = board.tasks

  if (filter === "completed") {
    filtered = board.tasks.filter((t) => t.completed)
  } else if (filter === "active") {
    filtered = board.tasks.filter((t) => !t.completed)
  }

  const totalTasks = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalTasks / limit))
  const startIndex = (page - 1) * limit
  const pagedTasks = filtered.slice(startIndex, startIndex + limit)

  return new Response(
    JSON.stringify({
      tasks: pagedTasks,
      totalPages,
      currentPage: page,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}