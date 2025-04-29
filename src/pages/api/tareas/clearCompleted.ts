import type { APIRoute } from 'astro';
import { limpiarCompletadas } from '../../../utils/tareas';

export const POST: APIRoute = async () => {
  limpiarCompletadas();

  return new Response(null, {
    status: 204
  });
};
