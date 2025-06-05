import type { APIRoute } from 'astro'
import { db } from '../../../services/db'  // Importa tu base de datos o servicio de tareas
import type { Tarea } from '../../../types/tarea'

export const GET: APIRoute = async ({ url }) => {
  // Leer query params para paginación y tablero
  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = Number(url.searchParams.get('limit') ?? '5')
  const tableroId = url.searchParams.get('tableroId') ?? ''

  // Obtener tareas filtradas por tablero
  let tareas = await db.getAll(tableroId)

  // Paginación
  const start = (page - 1) * limit
  const paginated = tareas.slice(start, start + limit)

  // Total para paginación en frontend
  const total = tareas.length

  return new Response(
    JSON.stringify({ tareas: paginated, total }),
    { status: 200 }
  )
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  // body debe incluir contenido, completed y tableroId
  const nuevaTarea: Tarea = await db.add(body)
  return new Response(JSON.stringify(nuevaTarea), { status: 201 })
}
