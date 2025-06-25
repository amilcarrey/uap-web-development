import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorMiddleware = (
  err: AppError, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
): void => {
  console.error(`Error: ${err.message}`, err);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message || "Error interno del servidor",
      code: err.code || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    }
  });
};