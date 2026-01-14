import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Endpoint para cerrar sesión del usuario
 * 
 * Nota: En un sistema JWT stateless, el logout se maneja principalmente
 * en el cliente eliminando el token. Este endpoint puede usarse para
 * logging o invalidación de tokens en implementaciones futuras.
 * 
 * @param request - Request con token en headers (opcional)
 * @returns Confirmación de logout exitoso
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener token del header Authorization (opcional)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    // Log del logout para auditoría (opcional)
    if (token) {
      console.log('🔓 Usuario cerró sesión:', new Date().toISOString());
      // Aquí podrías agregar lógica para invalidar el token en una blacklist
      // o registrar el evento en una tabla de auditoría
    }
    
    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada exitosamente'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error en logout:', error);
    
    // Error genérico del servidor
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * Manejo de métodos HTTP no permitidos
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido. Use POST para cerrar sesión.'
    },
    { status: 405 }
  );
}