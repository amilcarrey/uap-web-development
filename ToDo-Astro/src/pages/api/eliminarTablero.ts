import type { APIRoute } from "astro";
import { obtenerTablero, eliminarTablero } from "../../lib/tareas";

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { alias } = await request.json();
    
    if (!alias) {
      return new Response(JSON.stringify({ error: "Alias requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtener el tablero por alias para conseguir el ID
    const tablero = obtenerTablero(alias);
    
    if (!tablero) {
      return new Response(JSON.stringify({ error: "Tablero no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verificar que no sea un tablero protegido
    if (alias === "configuracion") {
      return new Response(JSON.stringify({ error: "No se puede eliminar el tablero de configuración" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const eliminado = eliminarTablero(tablero.id);
    
    if (!eliminado) {
      return new Response(JSON.stringify({ error: "Error al eliminar tablero" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      mensaje: `Tablero "${tablero.nombre}" eliminado correctamente`,
      tablero: {
        id: tablero.id,
        alias: tablero.alias,
        nombre: tablero.nombre
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    return new Response(JSON.stringify({ error: "Error al eliminar tablero" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};