const Permiso = require('../models/Permiso');
const Tablero = require('../models/Tablero');

// Middleware para autorizar acceso a un tablero según roles permitidos
const autorizarPermisoTablero = (rolesPermitidos) => {
  return async (req, res, next) => {
    const usuarioId = req.usuario.id_usuario; // ID del usuario autenticado
    const tableroId = req.params.id; // ID del tablero desde los parámetros de la ruta

    try {
      // Busca el tablero por su ID
      const tablero = await Tablero.findByPk(tableroId);
      if (!tablero) 
        // Si no existe el tablero, responde con 404
        return res.status(404).json({ mensaje: 'Tablero no encontrado' });

      // Si el usuario es el propietario del tablero, permite el acceso
      if (tablero.propietario_id === usuarioId) {
        return next();
      }

      // Si no es propietario, verifica si tiene permisos compartidos
      const permiso = await Permiso.findOne({
        where: { usuario_id: usuarioId, tablero_id: tableroId }
      });

      // Si no tiene permiso o el tipo de permiso no está permitido, responde con 403
      if (!permiso || !rolesPermitidos.includes(permiso.tipo_permiso)) {
        return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
      }

      // Si pasa todas las validaciones, continúa con la siguiente función middleware
      next();
    } catch (error) {
      // Manejo de errores del servidor
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  };
};

module.exports = { autorizarPermisoTablero };
