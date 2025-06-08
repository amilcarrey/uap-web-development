import type { APIRoute } from "astro"
import { state } from "./state"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const name = formData.get("name")?.toString() || "Nuevo tablero"
  const id = crypto.randomUUID()
  state.boards.push({ id, name, tasks: [], nextTaskId: 1 })
  return new Response(JSON.stringify({ id, name }), { headers: { "Content-Type": "application/json" } })
}