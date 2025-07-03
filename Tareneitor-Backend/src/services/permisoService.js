// Importa los servicios necesarios
const permisoService = require('../services/permisoService');
const usuarioService = require('../services/usuarioService');

// Controlador para agregar un permiso a un usuario en un tablero
const agregarPermiso = async (req, res) => {
  const tablero_id = req.params.id;
  const { correo, permiso } = req.body;

  // Verifica que se hayan enviado el correo y el permiso
  if (!correo || !permiso) {
    return res.status(400).json({ error: 'Correo y permiso son requeridos' });
  }

  try {
    // Busca el usuario por correo
    const usuario = await usuarioService.buscarPorCorreo(correo);

    // Si no existe el usuario, retorna error
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado con ese correo' });
    }

    // Agrega el permiso al usuario en el tablero
    const nuevoPermiso = await permisoService.agregarPermiso(tablero_id, usuario.id_usuario, permiso);
    res.status(201).json(nuevoPermiso);
  } catch (error) {
    // Maneja errores y retorna mensaje adecuado
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para obtener los permisos de un tablero
const obtenerPermisos = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtiene los permisos asociados al tablero
    const permisos = await permisoService.obtenerPermisos(id);
    res.json(permisos);
  } catch (error) {
    // Maneja errores y retorna mensaje adecuado
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener permisos' });
  }
};

// Controlador para quitar un permiso de un usuario en un tablero
const quitarPermiso = async (req, res) => {
  const { id, usuarioId } = req.params;
  try {
    // Intenta quitar el permiso
    const resultado = await permisoService.quitarPermiso(id, usuarioId);
    if (resultado === 0) {
      // Si no se encontró el permiso, retorna error
      return res.status(404).json({ mensaje: 'Permiso no encontrado para eliminar.' });
    }
    // Permiso eliminado correctamente
    res.json({ mensaje: 'Permiso eliminado correctamente' });
  } catch (error) {
    // Maneja errores y retorna mensaje adecuado
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar permiso' });
  }
};

// Exporta los controladores
module.exports = {
  agregarPermiso,
  obtenerPermisos,
  quitarPermiso,
};
