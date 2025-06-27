import { Request, Response } from 'express';
import { 
  crearTablero, 
  obtenerTablerosUsuario, 
  obtenerTablero, 
  actualizarTablero, 
  eliminarTablero, 
  compartirTablero, 
  eliminarPermiso 
} from '../services/tablero.service';


function isUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

function validarDatosTablero(nombre: string, descripcion?: string): string[] {
  const errores: string[] = [];
  
  if (!nombre || typeof nombre !== 'string') {
    errores.push('El nombre del tablero es requerido');
  } else if (nombre.trim().length === 0) {
    errores.push('El nombre del tablero no puede estar vacío');
  } else if (nombre.trim().length > 100) {
    errores.push('El nombre del tablero no puede exceder 100 caracteres');
  }
  
  if (descripcion !== undefined && typeof descripcion !== 'string') {
    errores.push('La descripción debe ser texto');
  } else if (descripcion && descripcion.trim().length > 500) {
    errores.push('La descripción no puede exceder 500 caracteres');
  }
  
  return errores;
}

function validarDatosCompartir(emailUsuario: string, rol: string): string[] {
  const errores: string[] = [];
  
  if (!emailUsuario || typeof emailUsuario !== 'string') {
    errores.push('El email del usuario es requerido');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUsuario.trim())) {
      errores.push('El formato del email no es válido');
    }
  }
  
  if (!rol || typeof rol !== 'string') {
    errores.push('El rol es requerido');
  } else if (!['EDITOR', 'LECTOR'].includes(rol)) {
    errores.push('El rol debe ser EDITOR o LECTOR');
  }
  
  return errores;
}

export async function crearTableroHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const { nombre, descripcion } = req.body;
    
    const errores = validarDatosTablero(nombre, descripcion);
    if (errores.length > 0) {
      res.status(400).json({ error: 'Datos inválidos', errores });
      return;
    }
    if (errores.length > 0) {
      res.status(400).json({ errores });
      return;
    }

    const tablero = await crearTablero(usuarioId, req.body);
    res.status(201).json({ 
      mensaje: 'Tablero creado exitosamente', 
      tablero 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function obtenerTablerosHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const tableros = await obtenerTablerosUsuario(usuarioId);
    res.status(200).json({ tableros });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function obtenerTableroHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'ID del tablero requerido' });
      return;
    }

    if (!isUUID(id)) {
      res.status(400).json({ error: 'ID del tablero requerido' });
      return;
    }

    const tablero = await obtenerTablero(id, usuarioId);
    res.status(200).json({ tablero });
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado' || error.message === 'No tienes acceso a este tablero') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function actualizarTableroHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const tablero = await actualizarTablero(id, usuarioId, req.body);
    res.status(200).json({ 
      mensaje: 'Tablero actualizado exitosamente', 
      tablero 
    });
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Solo el propietario puede editar el tablero') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export async function eliminarTableroHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const resultado = await eliminarTablero(id, usuarioId);
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Solo el propietario puede eliminar el tablero') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export async function compartirTableroHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const { emailUsuario, rol } = req.body;
    const tableroId = req.params.id;

    if (!isUUID(tableroId)) {
      res.status(400).json({ error: 'ID de tablero inválido' });
      return;
    }

    const errores = validarDatosCompartir(emailUsuario, rol);
    if (errores.length > 0) {
      res.status(400).json({ error: 'Datos inválidos', errores });
      return;
    }

    const permiso = await compartirTablero(usuarioId, {
      tableroId,
      emailUsuario,
      rol
    });
    
    res.status(200).json({ 
      mensaje: 'Tablero compartido exitosamente', 
      permiso 
    });
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado' || error.message.includes('no está registrado')) {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Solo el propietario puede compartir el tablero') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export async function eliminarPermisoHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { id: tableroId, usuarioId: usuarioPermisoId } = req.params;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const resultado = await eliminarPermiso(usuarioId, tableroId, parseInt(usuarioPermisoId));
    res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === 'Tablero no encontrado' || error.message === 'Permiso no encontrado') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Solo el propietario puede eliminar permisos') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
