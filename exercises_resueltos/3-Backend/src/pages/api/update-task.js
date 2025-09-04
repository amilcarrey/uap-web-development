import { updateTask } from '../../tasks.js';

export async function POST({ request }) {
  const formData = await request.formData();
  const id = parseInt(formData.get('id'));
  const status = formData.get('status');
  if (id && status) {
    updateTask(id, status);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: '/' }
  });
}
