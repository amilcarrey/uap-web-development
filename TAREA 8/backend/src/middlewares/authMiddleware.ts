import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { Rol } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';

interface UsuarioRequest extends Request {
  usuario?: {
    id: number;
    email: string;
  };
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {

  let token = '';
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {

    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const verificarPermisoTablero = (rolesPermitidos: Rol[]) => {
  return async (req: UsuarioRequest, res: Response, next: NextFunction) => {
    try {
      const tableroId = req.params.id || req.params.tableroId || (req.body && req.body.tableroId);
      const usuarioId = req.usuario?.id;

      if (!tableroId) {
        res.status(400).json({ error: 'ID del tablero requerido' });
        return;
      }

      if (!usuarioId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }


      const tablero = await prisma.tablero.findUnique({
        where: { id: tableroId },
        include: { 
          permisos: {
            where: { usuarioId }
          }
        }
      });

      if (!tablero) {
        res.status(404).json({ error: 'Tablero no encontrado' });
        return;
      }


      if (tablero.creadoPorId === usuarioId) {
        req.rolUsuario = Rol.PROPIETARIO;
        next();
        return;
      }


      const permiso = tablero.permisos[0];
      if (!permiso || !rolesPermitidos.includes(permiso.rol)) {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        return;
      }

      req.rolUsuario = permiso.rol;
      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

export const verificarPropietario = verificarPermisoTablero([Rol.PROPIETARIO]);
export const verificarEditor = verificarPermisoTablero([Rol.PROPIETARIO, Rol.EDITOR]);
export const verificarLector = verificarPermisoTablero([Rol.PROPIETARIO, Rol.EDITOR, Rol.LECTOR]);


const verificarPermisoTableroConTableroId = (rolesPermitidos: Rol[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuarioId = req.usuario?.id;
      const tableroId = req.params.tableroId; 

      if (!tableroId) {
        res.status(400).json({ error: 'ID del tablero requerido' });
        return;
      }

      if (!usuarioId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }


      const tablero = await prisma.tablero.findUnique({
        where: { id: tableroId },
        include: { 
          permisos: {
            where: { usuarioId }
          }
        }
      });

      if (!tablero) {
        res.status(404).json({ error: 'Tablero no encontrado' });
        return;
      }


      if (tablero.creadoPorId === usuarioId) {
        req.rolUsuario = Rol.PROPIETARIO;
        next();
        return;
      }


      const permiso = tablero.permisos[0];
      if (!permiso || !rolesPermitidos.includes(permiso.rol)) {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        return;
      }

      req.rolUsuario = permiso.rol;
      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

export const verificarPropietarioTableroId = verificarPermisoTableroConTableroId([Rol.PROPIETARIO]);
export const verificarEditorTableroId = verificarPermisoTableroConTableroId([Rol.PROPIETARIO, Rol.EDITOR]);
export const verificarLectorTableroId = verificarPermisoTableroConTableroId([Rol.PROPIETARIO, Rol.EDITOR, Rol.LECTOR]);


declare global {
  namespace Express {
    interface Request {
      rolUsuario?: Rol;
    }
  }
}
