import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  userId?: string;
  nombre?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "No autenticado" });
    return
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string, nombre?: string };
    req.userId = payload.userId;
    req.nombre = payload.nombre;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};