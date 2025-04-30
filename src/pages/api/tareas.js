import { state } from '../../state.js';

export async function GET({ request }) {
  const url = new URL(request.url);
  const filtro = url.searchParams.get("filtro");

  let tareasFiltradas = state.tareas;

  if (filtro === "completadas") {
    tareasFiltradas = state.tareas.filter(t => t.completada);
  } else if (filtro === "pendientes") {
    tareasFiltradas = state.tareas.filter(t => !t.completada);
  }

  return new Response(JSON.stringify(tareasFiltradas), {
    headers: { 'Content-Type': 'application/json' },
  });
}
