// middlewares/permisos.ts
import { Request, Response, NextFunction } from 'express';
import db from '../db';

export const verificarPermiso = (rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuarioId = req.usuario?.id;
        const tableroId = req.params.id || req.body.tableroId;

        if (!usuarioId || !tableroId) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const permiso = db.prepare(`
  SELECT rol FROM permisos_tablero
  WHERE tableroId = ? AND usuarioId = ?
`).get(tableroId, usuarioId) as { rol: string };


        if (!permiso || !rolesPermitidos.includes(permiso.rol)) {
            return res.status(403).json({ error: 'Permiso insuficiente' });
        }

        next();
    };
};
