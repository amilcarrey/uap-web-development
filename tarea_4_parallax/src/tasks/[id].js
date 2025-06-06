// src/pages/api/tasks/[id].js
import { state } from '../../../state';

/** PUT /api/tasks/:id */
export async function PUT({ request, params }) {
  const { id } = params; // Extrae el :id de la ruta
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    return new Response(JSON.stringify({ error: 'Tarea no encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.completed !== undefined) {
    task.completed = Boolean(body.completed);
  }
  if (body.text !== undefined && typeof body.text === 'string') {
    task.text = body.text.trim();
  }

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** DELETE /api/tasks/:id */
export async function DELETE({ params }) {
  const { id } = params;
  const beforeCount = state.tasks.length;
  state.tasks = state.tasks.filter((t) => t.id !== id);

  if (state.tasks.length === beforeCount) {
    return new Response(JSON.stringify({ error: 'Tarea no encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, { status: 204 });
}
