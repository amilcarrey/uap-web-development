const Tarea = require('../models/Tarea');
const Tablero = require('../models/Tablero');
const Permiso = require('../models/Permiso');

/**
 * Crea una nueva tarea en un tablero si el usuario tiene permisos.
 */
async function crearTarea({ tableroId, contenido, usuarioId }) {
  const tablero = await Tablero.findByPk(tableroId);
  if (!tablero) throw { status: 404, mensaje: 'Tablero no encontrado' };

  // Verifica permisos de edición o propiedad
  if (tablero.propietario_id !== usuarioId) {
    const permiso = await Permiso.findOne({ where: { tablero_id: tableroId, usuario_id: usuarioId } });
    if (!permiso || (permiso.permiso !== 'editor' && permiso.permiso !== 'propietario')) {
      throw { status: 403, mensaje: 'No tiene permiso para crear tareas' };
    }
  }

  const tarea = await Tarea.create({ contenido, tablero_id: tableroId });
  return tarea;
}

/**
 * Obtiene todas las tareas de un tablero si el usuario tiene permisos.
 * Permite filtrar por estado de completada.
 */
async function obtenerTareas({ tableroId, usuarioId, completada }) {
  const tablero = await Tablero.findByPk(tableroId);
  if (!tablero) throw { status: 404, mensaje: 'Tablero no encontrado' };

  // Verifica permisos de visualización
  if (tablero.propietario_id !== usuarioId) {
    const permiso = await Permiso.findOne({ where: { tablero_id: tableroId, usuario_id: usuarioId } });
    if (!permiso) {
      throw { status: 403, mensaje: 'No tiene permiso para ver tareas' };
    }
  }

  // Filtro opcional por estado de completada
  const where = { tablero_id: tableroId };
  if (completada !== undefined) {
    if (completada === 'true') where.completada = true;
    else if (completada === 'false') where.completada = false;
  }

  return await Tarea.findAll({ where });
}

/**
 * Actualiza una tarea si el usuario tiene permisos.
 */
async function actualizarTarea({ tareaId, contenido, completada, usuarioId }) {
  const tarea = await Tarea.findByPk(tareaId);
  if (!tarea) throw { status: 404, mensaje: 'Tarea no encontrada' };

  const tablero = await Tablero.findByPk(tarea.tablero_id);
  if (!tablero) throw { status: 404, mensaje: 'Tablero no encontrado' };

  // Verifica permisos de edición o propiedad
  if (tablero.propietario_id !== usuarioId) {
    const permiso = await Permiso.findOne({ where: { tablero_id: tablero.id_tablero, usuario_id: usuarioId } });
    if (!permiso || (permiso.permiso !== 'editor' && permiso.permiso !== 'propietario')) {
      throw { status: 403, mensaje: 'No tiene permiso para actualizar tareas' };
    }
  }

  // Actualiza campos si se proporcionan
  if (contenido !== undefined) tarea.contenido = contenido;
  if (completada !== undefined) tarea.completada = completada;

  await tarea.save();
  return tarea;
}

/**
 * Elimina una tarea si el usuario tiene permisos.
 */
async function eliminarTarea({ tareaId, usuarioId }) {
  const tarea = await Tarea.findByPk(tareaId);
  if (!tarea) throw { status: 404, mensaje: 'Tarea no encontrada' };

  const tablero = await Tablero.findByPk(tarea.tablero_id);
  if (!tablero) throw { status: 404, mensaje: 'Tablero no encontrado' };

  // Verifica permisos de edición o propiedad
  if (tablero.propietario_id !== usuarioId) {
    const permiso = await Permiso.findOne({ where: { tablero_id: tablero.id_tablero, usuario_id: usuarioId } });
    if (!permiso || (permiso.permiso !== 'editor' && permiso.permiso !== 'propietario')) {
      throw { status: 403, mensaje: 'No tiene permiso para eliminar tareas' };
    }
  }

  await tarea.destroy();
  return;
}

/**
 * Elimina todas las tareas completadas (o según filtro) de un tablero si el usuario tiene permisos.
 */
async function eliminarTareasCompletadas({ tableroId, usuarioId, completada }) {
  const tablero = await Tablero.findByPk(tableroId);
  if (!tablero) throw { status: 404, mensaje: 'Tablero no encontrado' };

  // Verifica permisos de edición o propiedad
  if (tablero.propietario_id !== usuarioId) {
    const permiso = await Permiso.findOne({ where: { tablero_id: tableroId, usuario_id: usuarioId } });
    if (!permiso || (permiso.permiso !== 'editor' && permiso.permiso !== 'propietario')) {
      throw { status: 403, mensaje: 'No tiene permiso para eliminar tareas' };
    }
  }

  // Filtro opcional por estado de completada
  const where = { tablero_id: tableroId };
  if (completada !== undefined) {
    if (completada === 'true') where.completada = true;
    else if (completada === 'false') where.completada = false;
  }

  await Tarea.destroy({ where });
}

module.exports = {
  crearTarea, 
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
  obtenerTareas,
  eliminarTareasCompletadas
};
