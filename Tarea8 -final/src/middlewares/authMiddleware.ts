import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "nando"; 

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload; // Guardá info de usuario en la request
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
