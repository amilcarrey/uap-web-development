
import { deleteTask } from '../../tasks.js';

export async function POST({ request }) {
  const formData = await request.formData();
  const id = parseInt(formData.get('id'));
  if (id) {
    deleteTask(id);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: '/' }
  });
}
