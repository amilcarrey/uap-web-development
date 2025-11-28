import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from '../../../lib/middleware/auth';

/**
 * Endpoint para verificar si el usuario está autenticado
 * GET /api/auth/verify
 */
export async function GET(request: NextRequest) {
  try {
    // Validar token de autenticación
    const authResult = await validateAuthToken(request);
    
    if (!authResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'No autenticado',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // Usuario autenticado correctamente
    return NextResponse.json(
      {
        success: true,
        message: 'Usuario autenticado',
        user: {
          id: authResult.user!.id,
          email: authResult.user!.email,
          nombre: authResult.user!.nombre
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en verificación de autenticación:', error);
    
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
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido. Use GET para verificar autenticación.'
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido. Use GET para verificar autenticación.'
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido. Use GET para verificar autenticación.'
    },
    { status: 405 }
  );
}