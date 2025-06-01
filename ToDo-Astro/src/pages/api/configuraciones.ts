import type { APIRoute } from "astro";
import { obtenerConfiguraciones, actualizarConfiguraciones, resetearConfiguraciones } from "../../lib/configuraciones";

export const GET: APIRoute = async () => {
  try {
    const configuraciones = obtenerConfiguraciones();
    
    return new Response(JSON.stringify({ configuraciones }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener configuraciones" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (body.intervaloRefetch !== undefined && (typeof body.intervaloRefetch !== 'number' || body.intervaloRefetch < 1)) {
      return new Response(JSON.stringify({ error: "intervaloRefetch debe ser un número mayor a 0" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (body.descripcionMayusculas !== undefined && typeof body.descripcionMayusculas !== 'boolean') {
      return new Response(JSON.stringify({ error: "descripcionMayusculas debe ser un boolean" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const configuracionesActualizadas = actualizarConfiguraciones(body);
    
    return new Response(JSON.stringify({ 
      success: true, 
      configuraciones: configuracionesActualizadas 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al actualizar configuraciones" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async () => {
  try {
    const configuracionesReseteadas = resetearConfiguraciones();
    
    return new Response(JSON.stringify({ 
      success: true, 
      configuraciones: configuracionesReseteadas 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al resetear configuraciones" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};