import { Request, Response, NextFunction } from "express";

// Middleware para manejar promesas y errores en handlers async
export function requestHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}