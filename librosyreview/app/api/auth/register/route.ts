import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { UserService, UserValidationSchema } from '../../../lib/models/User';
import { z } from 'zod';

/**
 * POST /api/auth/register
 * Endpoint para registrar nuevos usuarios
 * 
 * @param request - Datos del usuario (nombre, email, password)
 * @returns Usuario creado (sin contraseña) y token JWT
 */
export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Obtener y validar datos del cuerpo de la petición
    const body = await request.json();
    
    // Validar estructura de datos con Zod
    const validatedData = UserValidationSchema.parse(body);
    
    // Crear nuevo usuario usando el servicio
    const newUser = await UserService.createUser(validatedData);
    
    // Generar token de autenticación
    const token = newUser.generateAuthToken();
    
    // Respuesta exitosa con usuario y token
    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: newUser.toJSON(), // Excluye la contraseña automáticamente
          token
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Error en registro de usuario:', error);
    
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
    
    // Manejo de error de email duplicado
    if (error instanceof Error && error.message.includes('ya está registrado')) {
      return NextResponse.json(
        {
          success: false,
          message: 'El email ya está registrado',
          error: 'DUPLICATE_EMAIL'
        },
        { status: 409 }
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
      message: 'Método no permitido. Use POST para registrar usuarios.'
    },
    { status: 405 }
  );
}