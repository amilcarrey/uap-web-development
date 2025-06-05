import type { APIRoute } from 'astro'
import { db } from '../../../services/db'
import type { Tarea } from '../../../types/tarea'

export const PUT: APIRoute = async ({ request, params }) => {
  const id = Number(params.id)
  const body = await request.json()
  const tareaEditada = await db.update(id, body)
  return new Response(JSON.stringify(tareaEditada), { status: 200 })
}

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id)
  await db.delete(id)
  return new Response(null, { status: 204 })
}
