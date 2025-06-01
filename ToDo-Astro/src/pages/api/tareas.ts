import type { APIRoute } from "astro";
import { listarTareas } from "../../lib/tareas";

export const GET: APIRoute = async ({ url }) => {
  const params = new URLSearchParams(url.search);
  const idTablero = params.get("idTablero");
  const pagina = parseInt(params.get("pagina") || "1");
  const filtro = params.get("filtro") as "completadas" | "pendientes" | null;
  const limite = parseInt(params.get("limite") || "5");

  if (!idTablero) {
    return new Response(JSON.stringify({ error: "idTablero es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Obtener tareas del tablero específico
    const todasLasTareas = listarTareas(idTablero, filtro || undefined);
    
    // Calcular paginación
    const totalTareas = todasLasTareas.length;
    const totalPaginas = Math.ceil(totalTareas / limite);
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;
    
    // Obtener tareas de la página actual
    const tareas = todasLasTareas.slice(inicio, fin);

    const response = {
      tareas,
      totalPaginas,
      paginaActual: pagina,
      totalTareas,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener tareas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};