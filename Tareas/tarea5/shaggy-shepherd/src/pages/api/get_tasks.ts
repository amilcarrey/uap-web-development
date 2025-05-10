import { getTasks } from '../../server/tasks.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log("GET request received for /api/get_tasks");

  const tasks = getTasks();

  return new Response(JSON.stringify({ success: true, tasks }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
