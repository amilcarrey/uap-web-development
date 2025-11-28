// Middleware de autorización JWT
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Cambiar de named import a default import
import { connectToDatabase } from '../db';

/**
 * Interface para el payload del JWT token
 */
export interface JWTPayload {
  userId: string;
  email: string;
  nombre: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

/**
 * Interface para el request extendido con información del usuario
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    nombre: string;
  };
}

/**
 * Middleware para validar tokens JWT y extraer información del usuario
 * @param request - Request de Next.js
 * @returns Información del usuario autenticado o null si no es válido
 */
export async function validateAuthToken(request: NextRequest): Promise<{
  isValid: boolean;
  user?: {
    id: string;
    email: string;
    nombre: string;
  };
  error?: string;
}> {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Extraer token del header Authorization o de las cookies
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remover 'Bearer '
    } else {
      // Buscar en cookies si no está en el header
      token = request.cookies.get('token')?.value;
    }
    
    if (!token) {
      return {
        isValid: false,
        error: 'Token de autorización requerido'
      };
    }

    // Verificar que existe la clave secreta
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return {
        isValid: false,
        error: 'Usuario no encontrado o inactivo'
      };
    }

    return {
      isValid: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre
      }
    };

  } catch (error) {
    // Manejar errores específicos de JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        isValid: false,
        error: 'Token inválido'
      };
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return {
        isValid: false,
        error: 'Token expirado'
      };
    }

    return {
      isValid: false,
      error: 'Error de autorización'
    };
  }
}

/**
 * Helper para crear respuestas de error de autorización
 * @param message - Mensaje de error
 * @param status - Código de estado HTTP
 * @returns Response de error
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
  return Response.json(
    {
      success: false,
      message,
      error: 'UNAUTHORIZED'
    },
    { status }
  );
}