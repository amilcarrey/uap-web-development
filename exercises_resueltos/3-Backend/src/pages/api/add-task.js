
import { addTask } from '../../tasks.js';

export async function POST({ request }) {
  const formData = await request.formData();
  const description = formData.get('description');
  if (description) {
    addTask(description);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: '/' }
  });
}
