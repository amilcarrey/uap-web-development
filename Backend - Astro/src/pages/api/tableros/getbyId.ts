import type { APIRoute } from "astro";
import { obtenerTablero } from "../../../utils/tableros";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const idParam = data.id;

    if (!idParam) {
      return new Response(JSON.stringify({ error: 'ID no proporcionado' }), { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
    }

    const tablero = obtenerTablero(id);
    if (!tablero) {
      return new Response(JSON.stringify({ error: 'Tablero no encontrado' }), { status: 404 });
    }

    return new Response(JSON.stringify({ board: tablero }), { status: 200 });
  } catch (error) {
    console.error('Error en el backend:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { status: 500 });
  }
};
