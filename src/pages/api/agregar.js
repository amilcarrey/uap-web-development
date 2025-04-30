export const prerender = false;
import { state } from '../../state.js';

export async function POST({ request }) {
  const { texto } = await request.json();  // Utiliza request.json() para leer el JSON del cuerpo de la solicitud

  if (texto && texto.trim() !== "") {
    state.tareas.push({ id: Date.now(), texto, completada: false });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ ok: false, error: "Texto vacío" }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}
