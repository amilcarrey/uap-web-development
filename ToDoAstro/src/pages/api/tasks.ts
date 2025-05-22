import { tareas } from '../../lib/tareas';

export async function GET() {
  return new Response(JSON.stringify(tareas.map((t, i) => ({ ...t, id: i }))), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
