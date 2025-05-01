import { deleteTask } from '../../../lib/tareas.js';

export async function POST({ request }) {
  const formData = await request.formData();
  const id = formData.get('id');

  if (id) {
    await deleteTask(id);
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/' },
  });
}
