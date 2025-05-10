import { deleteTask } from '../../server/tasks.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ url, redirect }) => {
  const idParam = url.searchParams.get("id");
  const id = Number(idParam);

  if (!idParam || isNaN(id)) {
    return new Response("Invalid or missing ID", { status: 400 });
  }

  deleteTask(id);
  return redirect("/");
};
