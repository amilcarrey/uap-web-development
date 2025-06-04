import type { APIRoute } from 'astro';
import { editarTarea } from '../../../utils/tareas';

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, descripcion } = body;

    if (typeof id !== 'number' || !descripcion || typeof descripcion !== 'string') {
      return new Response(JSON.stringify({
        error: 'No se han recibido ID o nueva descripción, o fueron recibidos en un formato no adecuado.',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tareaEditada = editarTarea(id, descripcion);

    if (!tareaEditada) {
      return new Response(JSON.stringify({
        error: 'No se encontró la tarea con el ID especificado',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Tarea con id ${id} editada correctamente.`);

    return new Response(JSON.stringify(tareaEditada), {
    
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al editar la tarea:', error);
    return new Response(JSON.stringify({
      error: 'Error interno del servidor',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
