export const prerender = false;
import { state } from '../../state.js';

export async function POST({ request }) {
  const { index } = await request.json();
  const i = parseInt(index);

  if (state.tareas[i]) {
    state.tareas[i].completada = !state.tareas[i].completada;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: false, error: "Tarea no encontrada" }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}
