const permisoService = require('../services/permisoService');
const Usuario = require('../models/Usuario');

// Controlador para agregar un permiso a un usuario en un tablero
const agregarPermiso = async (req, res) => {
  const tablero_id = req.params.id;
  const { correo, permiso } = req.body;

  // Validar que se envíen el correo y el permiso
  if (!correo || !permiso) {
    return res.status(400).json({ error: 'Correo y permiso son requeridos' });
  }

  try {
    // Buscar el usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Agregar el permiso usando el servicio
    const nuevoPermiso = await permisoService.agregarPermiso(tablero_id, usuario.id_usuario, permiso);
    res.status(201).json(nuevoPermiso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para obtener los permisos de un tablero
const obtenerPermisos = async (req, res) => {
  const { id } = req.params; // tablero_id
  try {
    // Obtener los permisos usando el servicio
    const permisos = await permisoService.obtenerPermisos(id);
    res.json(permisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener permisos' });
  }
};

// Controlador para quitar un permiso de un usuario en un tablero
const quitarPermiso = async (req, res) => {
  const { id, usuarioId } = req.params; // tablero_id, usuario_id
  try {
    // Quitar el permiso usando el servicio
    const resultado = await permisoService.quitarPermiso(id, usuarioId);
    if (resultado === 0) {
      return res.status(404).json({ mensaje: 'Permiso no encontrado para eliminar.' });
    }
    res.json({ mensaje: 'Permiso eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar permiso' });
  }
};

module.exports = {
  agregarPermiso,
  obtenerPermisos,
  quitarPermiso,
};
