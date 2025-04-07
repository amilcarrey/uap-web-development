import type { APIRoute } from 'astro';
import { toggleTask } from '../lib/TaskStore';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = Number(formData.get('id'));

  if (!isNaN(id)) {
    toggleTask(id);
  }

  return redirect('/');
};
