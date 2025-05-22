import type { APIRoute } from 'astro';
import { addTask } from '../lib/TaskStore';

export const prerender = false; // 👈 necesario para manejar POST

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const text = formData.get('text');

  console.log('📥 Recibido POST en /add-task');
  console.log('➡️ Texto:', text);

  if (typeof text === 'string' && text.trim() !== '') {
    addTask(text.trim());
  }

  return redirect('/');
};
