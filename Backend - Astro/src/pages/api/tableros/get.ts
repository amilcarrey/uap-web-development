import type { APIRoute } from "astro";
import { obtenerTableros } from "../../../utils/tableros";

export const GET: APIRoute = async () => {
  try {
    const tableros = obtenerTableros();
    return new Response(JSON.stringify(tableros), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error en el backend:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { status: 500 });
  }
};
