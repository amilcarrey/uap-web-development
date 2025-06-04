import type { APIRoute } from 'astro';
import { state } from './state';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const taskText = formData.get('task');

  if (typeof taskText === 'string' && taskText.trim() !== '') {
    state.tasks.push({
      id: state.nextId++,
      task_content: taskText.trim(),
      completed: false,
    });
  }

  return new Response(JSON.stringify(state.tasks), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
