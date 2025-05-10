
import type { APIRoute } from 'astro';
import { alternarEstado, obtenerEstado } from '../../../utils/tareas';


export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const id = parseInt(data.id?.toString() || '', 10);

    if (isNaN(id)) {
      return new Response('ID inválido', { status: 400 });
    }

    alternarEstado(id);
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Error al alternar estado:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '', 10);

    if (isNaN(id)) {
      return new Response('ID inválido', { status: 400 });
    }

    const estado = obtenerEstado(id);

    if (estado === undefined) {
      return new Response('Tarea no encontrada', { status: 404 });
    }

    return new Response(JSON.stringify({ estado }), { status: 200 });

  } catch (error) {
    console.error('Error al obtener estado:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
