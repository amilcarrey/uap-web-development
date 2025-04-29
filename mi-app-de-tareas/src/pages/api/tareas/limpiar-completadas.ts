export const prerender = false;

const globalState = globalThis.globalState || { tareas: [], filtroActual: 'todas' };
globalThis.globalState = globalState;

export async function POST() {
  globalState.tareas = globalState.tareas.filter(t => !t.completada);

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/',
    },
  });
}
