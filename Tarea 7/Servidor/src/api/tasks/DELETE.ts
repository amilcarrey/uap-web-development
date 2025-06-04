import type { APIRoute } from 'astro';
import { deleteTask } from '@lib/taskService';

export const DELETE: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const taskId = formData.get('taskId') as string;

  try {
    await deleteTask(taskId);
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error("[ERROR API /api/tasks/DELETE]:", error); // Para depuración, asi se puede ver en la consola donde se produce el error de forma rápida

    return new Response(JSON.stringify({ error: 'Delete failed' }), { 
      status: 500 
    });
  }
};