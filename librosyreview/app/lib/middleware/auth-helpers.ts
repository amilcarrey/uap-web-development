// Helpers para usar el middleware en las rutas
import { NextRequest } from 'next/server';
import { validateAuthToken, createAuthErrorResponse } from './auth';

/**
 * Wrapper para proteger rutas que requieren autenticación
 * @param handler - Función handler de la ruta
 * @returns Handler protegido con autenticación
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, user: { id: string; email: string; nombre: string }, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    // Validar token de autorización
    const authResult = await validateAuthToken(request);
    
    if (!authResult.isValid) {
      return createAuthErrorResponse(authResult.error || 'No autorizado');
    }

    // Ejecutar el handler original con la información del usuario
    return handler(request, authResult.user!, ...args);
  };
}

/**
 * Middleware opcional - permite acceso sin autenticación pero incluye info del usuario si está autenticado
 * @param handler - Función handler de la ruta
 * @returns Handler con autenticación opcional
 */
export function withOptionalAuth<T extends any[]>(
  handler: (request: NextRequest, user: { id: string; email: string; nombre: string } | null, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    // Intentar validar token (sin fallar si no existe)
    const authResult = await validateAuthToken(request);
    
    const user = authResult.isValid ? authResult.user! : null;
    
    // Ejecutar el handler con usuario (puede ser null)
    return handler(request, user, ...args);
  };
}