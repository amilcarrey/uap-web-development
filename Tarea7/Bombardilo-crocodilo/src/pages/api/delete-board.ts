import type { APIRoute } from "astro"
import { state } from "./state"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const id = formData.get("id")?.toString()
  state.boards = state.boards.filter((b) => b.id !== id)
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
}