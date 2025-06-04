import type { APIRoute } from 'astro';
import { eliminarTarea } from '../../../utils/tareas';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const id = parseInt(data.id?.toString() || '', 10);

    if (isNaN(id)) {
      console.error('ID no es un número válido:', data.id);
      return new Response('ID inválido', { status: 400 });
    }

    eliminarTarea(id);
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
