import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}


export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const token = req.signedCookies.token;
    
    if (!token) {
      res.status(401).json({ error: "Autenticación requerida" });
      return;
    }
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string; email: string };
    
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    res.status(401).json({ error: "Token inválido" });
  }
};