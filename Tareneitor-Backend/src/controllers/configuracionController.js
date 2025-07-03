const configuracionService = require('../services/configuracionService');

// Controlador para crear una nueva configuración de usuario
const crearConfiguracion = async (req, res) => {
  const usuario_id = req.usuario.id_usuario;
  const { auto_refresh_interval, tema, notificaciones, idioma } = req.body;

  try {
    // Llama al servicio para crear la configuración
    const nueva = await configuracionService.crearConfiguracion(usuario_id, {
      auto_refresh_interval,
      tema,
      notificaciones,
      idioma,
    });
    res.status(201).json(nueva); // Devuelve la configuración creada
  } catch (error) {
    const status = error.status || 500;
    const mensaje = error.mensaje || 'Error al crear configuración';
    res.status(status).json({ mensaje }); // Manejo de errores
  }
};

// Controlador para obtener la configuración de un usuario
const obtenerConfiguracion = async (req, res) => {
  const usuario_id = req.usuario.id_usuario;

  try {
    // Llama al servicio para obtener la configuración
    const config = await configuracionService.obtenerConfiguracion(usuario_id);
    res.json(config); // Devuelve la configuración encontrada
  } catch (error) {
    const status = error.status || 500;
    const mensaje = error.mensaje || 'Error al obtener configuración';
    res.status(status).json({ mensaje }); // Manejo de errores
  }
};

// Controlador para actualizar la configuración de un usuario
const actualizarConfiguracion = async (req, res) => {
  const usuario_id = req.usuario.id_usuario;
  const { auto_refresh_interval, tema, notificaciones, idioma } = req.body;

  try {
    // Llama al servicio para actualizar la configuración
    const configActualizada = await configuracionService.actualizarConfiguracion(usuario_id, {
      auto_refresh_interval,
      tema,
      notificaciones,
      idioma,
    });
    res.json(configActualizada); // Devuelve la configuración actualizada
  } catch (error) {
    const status = error.status || 500;
    const mensaje = error.mensaje || 'Error al actualizar configuración';
    res.status(status).json({ mensaje }); // Manejo de errores
  }
};

// Controlador para restablecer la configuración de un usuario a los valores por defecto
const restablecerConfiguracion = async (req, res) => {
  const usuario_id = req.usuario.id_usuario;

  try {
    // Llama al servicio para restablecer la configuración
    const config = await configuracionService.restablecerConfiguracion(usuario_id);
    res.json(config); // Devuelve la configuración restablecida
  } catch (error) {
    const status = error.status || 500;
    const mensaje = error.mensaje || 'Error al restablecer configuración';
    res.status(status).json({ mensaje }); // Manejo de errores
  }
  
};

// Exporta los controladores para ser usados en las rutas
module.exports = {
  crearConfiguracion,
  obtenerConfiguracion,
  actualizarConfiguracion,
  restablecerConfiguracion,
};