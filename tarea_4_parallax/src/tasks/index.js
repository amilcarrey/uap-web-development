// src/pages/api/tasks/index.js
import { state } from '../../../state';

/** 
 * GET  /api/tasks
 *   → Devuelve array completo de tareas (JSON)
 */
export async function GET() {
  return new Response(JSON.stringify(state.tasks), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

/** 
 * POST /api/tasks
 *   Body JSON: { text }
 *   → Crea una nueva tarea y la devuelve (status 201)
 */
export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const { text } = body;
  if (!text || typeof text !== 'string') {
    return new Response(JSON.stringify({ error: 'Texto inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!Array.isArray(state.tasks)) {
    state.tasks = [];
  }
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  state.tasks.push(newTask);

  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

/** 
 * DELETE /api/tasks?completed=true
 *   → Elimina todas las tareas completadas (status 204)
 */
export async function DELETE({ url }) {
  const params = Object.fromEntries(url.searchParams);
  if (params.completed === 'true') {
    state.tasks = state.tasks.filter(t => !t.completed);
    return new Response(null, { status: 204 });
  }
  return new Response(JSON.stringify({ error: 'Ruta no válida' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
