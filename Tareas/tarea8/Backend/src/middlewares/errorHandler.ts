import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  if (res.headersSent) {
    return next(err);
  }

  
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({
    error: message,
    details: err.details || undefined,
  });
}
