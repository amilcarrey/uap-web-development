/**
    middleware para autenticar usuarios usando JWT.
    maneja la logica entre lo que llega de la request
    y lo que responde el endpoint.
    y verifica si el usuario esta autenticado
  verifica si el usuario esta autenticado leyendo del 
  JWT que se guarda en una cookie 
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; id: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Leer token del header
  const token = req.signedCookies["token"];


  if (!token) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const user = jwt.verify(token, "secret") as { email: string; id: string };
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
