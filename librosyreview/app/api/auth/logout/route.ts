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
    // Obtener token del header Authorization o de cookies
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = request.cookies.get('token')?.value;
    const token = headerToken || cookieToken;
    
    // Log del logout para auditoría (opcional)
    if (token) {
      console.log('🔓 Usuario cerró sesión:', new Date().toISOString());
      // Aquí podrías agregar lógica para invalidar el token en una blacklist
      // o registrar el evento en una tabla de auditoría
    }
    
    // Crear respuesta exitosa
    const response = NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada exitosamente'
      },
      { status: 200 }
    );

    // Limpiar la cookie del token
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expira inmediatamente
      path: '/'
    });

    return response;
    
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