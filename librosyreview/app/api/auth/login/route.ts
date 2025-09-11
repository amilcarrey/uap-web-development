import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { UserService, LoginValidationSchema } from '../../../lib/models/User';
import { z } from 'zod';

/**
 * POST /api/auth/login
 * Endpoint para autenticar usuarios existentes
 * 
 * @param request - Credenciales del usuario (email, password)
 * @returns Usuario autenticado y token JWT
 */
export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Obtener y validar datos del cuerpo de la petición
    const body = await request.json();
    
    // Validar estructura de datos con Zod
    const validatedData = LoginValidationSchema.parse(body);
    
    // Autenticar usuario usando el servicio
    const { user, token } = await UserService.authenticateUser(validatedData);
    
    // Respuesta exitosa con usuario y token
    return NextResponse.json(
      {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: user.toJSON(), // Excluye la contraseña automáticamente
          token
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error en inicio de sesión:', error);
    
    // Manejo específico de errores de validación Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    // Manejo de credenciales inválidas
    if (error instanceof Error && error.message.includes('Credenciales inválidas')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email o contraseña incorrectos',
          error: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }
    
    // Error de conexión a base de datos
    if (error instanceof Error && error.message.includes('conexión')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Error de conexión a la base de datos',
          error: 'DATABASE_CONNECTION_ERROR'
        },
        { status: 503 }
      );
    }
    
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
      message: 'Método no permitido. Use POST para iniciar sesión.'
    },
    { status: 405 }
  );
}