import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipo para errores personalizados
export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

// Middleware de manejo de errores global
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Error de validación personalizado
  if (err.name === 'ValidationError') {
    const message = 'Datos de entrada inválidos';
    error = { ...error, statusCode: 400, message };
  }

  // Error de base de datos SQLite
  if (err.message.includes('SQLITE_CONSTRAINT')) {
    const message = 'Conflicto en la base de datos - Registro duplicado';
    error = { ...error, statusCode: 409, message };
  }

  // Error de registro no encontrado
  if (err.message.includes('not found') || err.message.includes('no encontrado')) {
    error = { ...error, statusCode: 404 };
  }

  // Respuesta al cliente
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas (404)
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
};

// Middleware para crear errores personalizados
export const createError = (message: string, statusCode: number = 500): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Wrapper para funciones async (evita try-catch repetitivos)
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      res.status(401).json({ error: 'Token de acceso requerido' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};