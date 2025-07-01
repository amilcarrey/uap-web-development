import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';
import { RequestHandler } from 'express';

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    const decoded = verificarToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};