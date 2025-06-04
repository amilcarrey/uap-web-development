import type { APIRoute } from 'astro';
import { limpiarCompletadas } from '../../../utils/tareas';

export const POST: APIRoute = async () => {
  const eliminadas = limpiarCompletadas(); 

  return new Response(
    JSON.stringify({ eliminadas }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
