import { NextRequest } from 'next/server';
import { withAuth } from '../../../lib/middleware/auth-helpers';
import { connectToDatabase } from '../../../lib/db';

/**
 * Ruta de prueba protegida - requiere autenticación
 * GET /api/test/protected
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Respuesta exitosa con información del usuario autenticado
    return Response.json({
      success: true,
      message: 'Acceso autorizado a ruta protegida',
      data: {
        authenticatedUser: {
          id: user.id,
          email: user.email,
          nombre: user.nombre
        },
        timestamp: new Date().toISOString(),
        route: '/api/test/protected'
      }
    });

  } catch (error) {
    console.error('Error en ruta protegida:', error);
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