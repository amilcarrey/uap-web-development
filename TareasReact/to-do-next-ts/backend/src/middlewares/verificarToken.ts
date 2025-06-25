// middlewares/verificarToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario';
import db from '../db';

const JWT_SECRET = process.env.JWT_SECRET!;

export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const usuario = db
      .prepare('SELECT * FROM usuarios WHERE id = ?')
      .get(decoded.id) as Usuario;

    if (!usuario) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
