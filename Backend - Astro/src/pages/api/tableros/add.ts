import type { APIRoute } from "astro";
import { obtenerTableros, guardarTableros } from "../../../utils/tableros";


export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const nombre = data.nombre?.toString().trim();

  if (!nombre) {
    return new Response(JSON.stringify({ error: 'Nombre requerido' }), { status: 400 });
  }

  const nuevoTablero = { id: Date.now(), nombre }; 
  const tableros = obtenerTableros(); 
  tableros.push(nuevoTablero);
  guardarTableros(tableros);

  return new Response(JSON.stringify({ board: nuevoTablero }), { status: 201 });
};
