import { updateTask } from '../../lib/tasks.js';

export async function POST({ request }) {
  const contentType = request.headers.get('content-type') || '';
  const accept = request.headers.get('accept') || '';
  let id, status;

  if (contentType.includes('application/json')) {
    const data = await request.json();
    id = parseInt(data.id);
    status = data.status;
  } else {
    const formData = await request.formData();
    id = parseInt(formData.get('id'));
    status = formData.get('status');
  }

  if (id && status) {
    updateTask(id, status);
  }

  if (accept.includes('application/json') || contentType.includes('application/json')) {
    return new Response(
      JSON.stringify({ success: true, message: `Tarea ${id} actualizada a ${status}` }),
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