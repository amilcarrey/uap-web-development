import type { APIRoute } from "astro"
import { state } from "./state"

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify(state.boards.map(({ id, name }) => ({ id, name }))),
    { headers: { "Content-Type": "application/json" } }
  )
}