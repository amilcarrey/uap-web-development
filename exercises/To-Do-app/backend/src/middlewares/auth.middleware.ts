import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

interface JwtPayload {
  userId: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
      return;
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ error: 'No autorizado: Usuario no encontrado' });
      return;
    }

    // Agregar el usuario al objeto req
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'No autorizado: Token inválido' });
    return;
  }
};