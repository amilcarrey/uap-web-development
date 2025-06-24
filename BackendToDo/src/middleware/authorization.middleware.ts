import { Request, Response, NextFunction } from 'express';
import { verificarPermisoTablero, esPropietarioTablero, obtenerRolUsuario } from '../services/permisosService';
import { obtenerTablero } from '../services/tablerosService'; 
import { obtenerTareaPorId } from '../services/tareasService';
import { AuthRequest } from './error.middleware';

export const verificarAccesoTablero = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Obtener tableroId de diferentes fuentes
    const tableroId = req.params.id || 
                     req.params.tableroId || 
                     req.body.idTablero || 
                     req.query.idTablero;
    
    const usuarioId = req.userId;

    if (!tableroId) {
      return res.status(400).json({ error: "ID de tablero requerido" });
    }

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar si tiene acceso al tablero
    const tieneAcceso = await verificarPermisoTablero(usuarioId, tableroId as string);
    
    if (!tieneAcceso) {
      return res.status(403).json({ 
        error: "No tienes permisos para acceder a este tablero" 
      });
    }

    // Agregar el tableroId al request para uso posterior
    (req as any).tableroId = tableroId;
    next();
  } catch (error) {
    console.error('Error verificando acceso al tablero:', error);
    res.status(500).json({ error: "Error verificando permisos" });
  }
};

// Middleware para verificar que sea propietario del tablero
export const soloPropietario = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Buscar alias en params
    const alias = req.params.alias;
    const usuarioId = req.userId;

    if (!alias || !usuarioId) {
      return res.status(400).json({ error: "Datos insuficientes" });
    }

    // Buscar el tablero por alias
    const tablero = await obtenerTablero(alias);

    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    // Verificar si el usuario es el propietario
    if (tablero.propietarioId !== usuarioId) {
      return res.status(403).json({ 
        error: "Solo el propietario puede realizar esta acción" 
      });
    }

    (req as any).tableroId = tablero.id;
    next();
  } catch (error) {
    console.error('Error verificando propietario:', error);
    res.status(500).json({ error: "Error verificando permisos de propietario" });
  }
};

// Middleware para obtener tableroId desde alias y verificar acceso
export const verificarAccesoTableroByAlias = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { alias } = req.params;
    const usuarioId = req.userId;

    if (!alias || !usuarioId) {
      return res.status(400).json({ error: "Alias y usuario requeridos" });
    }

    const tablero = await obtenerTablero(alias);

    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    // Verificar acceso
    const tieneAcceso = await verificarPermisoTablero(usuarioId, tablero.id);
    
    if (!tieneAcceso) {
      return res.status(403).json({ 
        error: "No tienes permisos para acceder a este tablero" 
      });
    }

    // Agregar datos al request
    (req as any).tableroId = tablero.id;
    (req as any).tablero = tablero;
    next();
  } catch (error) {
    console.error('Error verificando acceso por alias:', error);
    res.status(500).json({ error: "Error verificando permisos" });
  }
};

// Middleware para requerir permisos específicos
export const requirePermission = (accionRequerida: 'leer' | 'escribir' | 'gestionar') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const usuarioId = req.userId;
      let tableroId = req.body.idTablero || req.query.idTablero;

      // Si no viene el idTablero pero sí el id de la tarea (por ejemplo, para editar/eliminar una tarea)
      if (!tableroId && req.params.id) {
        const tarea = await obtenerTareaPorId(Number(req.params.id));
        tableroId = tarea?.idTablero;
      }

      console.log('usuarioId:', usuarioId, 'tableroId:', tableroId);

      if (!usuarioId || !tableroId) {
        return res.status(400).json({ error: "Usuario y tablero requeridos" });
      }

      // Verificar el rol del usuario
      const rolUsuario = await obtenerRolUsuario(usuarioId, tableroId as string);
      
      if (!rolUsuario) {
        return res.status(403).json({ error: "Sin acceso a este tablero" });
      }

      // Verificar permisos según el rol
      const tienePermiso = verificarPermisoPorRol(rolUsuario, accionRequerida);
      
      if (!tienePermiso) {
        return res.status(403).json({ 
          error: `Permisos insuficientes. Requiere: ${accionRequerida}, tienes rol: ${rolUsuario}` 
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      res.status(500).json({ error: "Error verificando permisos" });
    }
  };
};

// Función auxiliar para verificar permisos por rol
function verificarPermisoPorRol(rol: string, accion: string): boolean {
  const permisos = {
    'propietario': ['leer', 'escribir', 'gestionar'],
    'editor': ['leer', 'escribir'], 
    'lector': ['leer']
  } as const;
  
  return (permisos as any)[rol]?.includes(accion) || false;
}