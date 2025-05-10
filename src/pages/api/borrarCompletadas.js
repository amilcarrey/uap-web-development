export const prerender = false;
import { state } from '../../state.js';

export async function POST() {
  state.tareas = state.tareas.filter(t => !t.completada);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
