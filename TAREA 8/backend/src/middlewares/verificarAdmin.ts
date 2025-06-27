import { Request, Response, NextFunction } from 'express';
import { ADMIN_EMAIL } from '../config/constants';

export const verificarAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const usuario = req.usuario;
  
  if (!usuario) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  if (usuario.email !== ADMIN_EMAIL) {
    res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
    return;
  }

  next();
};
