import type { APIRoute } from 'astro';
import { deleteTask } from '@lib/taskService';

export const DELETE: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const taskId = formData.get('taskId') as string;

  try {
    await deleteTask(taskId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), { 
      status: 500 
    });
  }
};