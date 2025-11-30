import { deleteTask } from '../../lib/tasks.js';

export async function POST({ request }) {
  const contentType = request.headers.get('content-type') || '';
  const accept = request.headers.get('accept') || '';
  let id;

  if (contentType.includes('application/json')) {
    const data = await request.json();
    id = parseInt(data.id);
  } else {
    const formData = await request.formData();
    id = parseInt(formData.get('id'));
  }

  if (id) {
    deleteTask(id);
  }

  if (accept.includes('application/json') || contentType.includes('application/json')) {
    return new Response(
      JSON.stringify({ success: true, message: `Tarea ${id} eliminada` }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/' },
  });
}