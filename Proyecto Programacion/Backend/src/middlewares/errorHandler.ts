import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Si ya se envió la respuesta, pasa al siguiente middleware
  if (res.headersSent) {
    return next(err);
  }

  // Puedes personalizar los códigos de error según el tipo de error
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({
    error: message,
    details: err.details || undefined,
  });
}