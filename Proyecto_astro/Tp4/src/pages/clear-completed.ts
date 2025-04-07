import type { APIRoute } from 'astro';
import { clearCompleted } from '../lib/TaskStore';

export const prerender = false;

export const POST: APIRoute = async ({ redirect }) => {
  clearCompleted();
  return redirect('/');
};
