export const prerender = false;
import { state } from '../../state.js';

export async function POST({ request }) {
  const { index } = await request.json();
  const i = parseInt(index);

  if (!isNaN(i) && i >= 0 && i < state.tareas.length) {
    state.tareas.splice(i, 1);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: false, error: "Índice inválido" }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}
