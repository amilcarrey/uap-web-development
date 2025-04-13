import { clearCompleted } from '../../lib/tasks.js';

export async function POST({ request }) {
  clearCompleted();

  const acceptHeader = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";

  if (acceptHeader.includes("text/html") || !contentType.includes("application/json")) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/' },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Tareas completadas eliminadas' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}