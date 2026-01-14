import { NextRequest } from 'next/server';
import { withOptionalAuth } from '../../../lib/middleware/auth-helpers';
import { connectDB } from '../../../lib/db';

/**
 * Ruta de prueba pública - autenticación opcional
 * GET /api/test/public
 */
export const GET = withOptionalAuth(async (request: NextRequest, user) => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Respuesta que varía según si el usuario está autenticado o no
    return Response.json({
      success: true,
      message: user ? 'Acceso público con usuario autenticado' : 'Acceso público sin autenticación',
      data: {
        isAuthenticated: !!user,
        user: user || null,
        timestamp: new Date().toISOString(),
        route: '/api/test/public'
      }
    });

  } catch (error) {
    console.error('Error en ruta pública:', error);
    return Response.json(
      {
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
});