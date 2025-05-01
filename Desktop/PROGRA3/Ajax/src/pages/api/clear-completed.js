import { clearCompletedTasks } from '../../../lib/tareas.js';

export async function POST() {
  await clearCompletedTasks();

  return new Response(null, {
    status: 303,
    headers: { Location: '/' },
  });
}
