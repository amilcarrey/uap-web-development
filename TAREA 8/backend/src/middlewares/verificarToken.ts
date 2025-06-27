import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';

interface JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

export const verificarToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded?.id) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        configuracion: true
      }
    });

    if (!usuario) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }
};
