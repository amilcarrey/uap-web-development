const Permiso = require('../models/Permiso');
const Tablero = require('../models/Tablero');

// Middleware para verificar si el usuario tiene permiso para modificar una tarea
const verificarPermisoTarea = async (req, res, next) => {
  const id_usuario = req.usuario.id_usuario; // ID del usuario autenticado
  const id_tarea = req.params.id; // ID de la tarea a modificar

  try {
    // Buscar la tarea por su ID
    const tarea = await require('../models/Tarea').findByPk(id_tarea);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    // Buscar el tablero asociado a la tarea
    const tablero = await Tablero.findByPk(tarea.tablero_id);
    if (!tablero) return res.status(404).json({ mensaje: 'Tablero no encontrado' });

    // Si el usuario es el propietario del tablero, permitir la acción
    if (tablero.propietario_id === id_usuario) return next();

    // Buscar si el usuario tiene permiso de editor en el tablero
    const permiso = await Permiso.findOne({
      where: {
        usuario_id: id_usuario,
        tablero_id: tablero.id_tablero
      }
    });

    // Si no tiene permiso de editor, denegar el acceso
    if (!permiso || permiso.tipo_permiso !== 'editor') {
      return res.status(403).json({ mensaje: 'No tiene permisos para modificar esta tarea' });
    }

    // Permitir la acción si tiene permiso de editor
    next();
  } catch (error) {
    // Manejar errores internos
    res.status(500).json({ mensaje: 'Error en permisos', error });
  }
};

module.exports = verificarPermisoTarea;
