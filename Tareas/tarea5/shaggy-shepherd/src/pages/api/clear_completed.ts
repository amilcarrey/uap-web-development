import { clearCompleted } from '../../server/tasks.ts';
import { getTasks } from '../../server/tasks.ts';  // Ensure getTasks() returns the latest task list
import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  console.log("POST request received for clearing completed tasks");

  clearCompleted();

  const tasks = getTasks();

  return new Response(
    JSON.stringify({ success: true, tasks }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
