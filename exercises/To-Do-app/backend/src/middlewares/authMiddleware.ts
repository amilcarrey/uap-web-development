import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.userId = decoded.userId; // Asignar userId al objeto req
    next();
  } catch (error) {
    res.status(401).json({ error: 'No autorizado: Token inválido' });
  }
};