import type { APIRoute } from "astro";
import { eliminarTablero } from "../../../utils/tableros";

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const idParam = data.id;

    if (idParam === undefined || idParam === null) {
      return new Response(
        JSON.stringify({ error: "ID no proporcionado" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: "ID inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const eliminado = eliminarTablero(id);
    if (!eliminado) {
      return new Response(
        JSON.stringify({ error: "Tablero no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Tablero eliminado" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en el backend:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
