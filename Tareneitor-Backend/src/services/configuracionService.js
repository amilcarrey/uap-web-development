// Importa el modelo Configuracion desde la carpeta de modelos
const Configuracion = require('../models/Configuracion');

// Define la configuración por defecto
const DEFAULT_CONFIG = {
  auto_refresh_interval: 10,
  tema: 'claro',
  notificaciones: true,
  idioma: 'es'
};

// Crea una nueva configuración para un usuario si no existe previamente
const crearConfiguracion = async (usuario_id, valores) => {
  // Busca si ya existe una configuración para el usuario
  const existente = await Configuracion.findOne({ where: { usuario_id } });
  if (existente) {
    // Si existe, lanza un error de conflicto
    const error = new Error('Configuración ya existe para este usuario');
    error.status = 409;
    throw error;
  }

  // Crea y retorna la nueva configuración
  return await Configuracion.create({
    usuario_id,
    ...valores,
  });
};

// Obtiene la configuración de un usuario, o la crea con valores por defecto si no existe
const obtenerConfiguracion = async (usuario_id) => {
  // Busca la configuración del usuario
  let config = await Configuracion.findOne({ where: { usuario_id } });

  // Si no existe, la crea con los valores por defecto
  if (!config) {
    config = await Configuracion.create({
      usuario_id,
      ...DEFAULT_CONFIG,
    });
  }

  // Retorna la configuración encontrada o creada
  return config;
};

// Actualiza la configuración de un usuario existente
const actualizarConfiguracion = async (usuario_id, valores) => {
  // Busca la configuración del usuario
  const config = await Configuracion.findOne({ where: { usuario_id } });

  // Si no existe, lanza un error de no encontrado
  if (!config) {
    const error = new Error('Configuración no encontrada');
    error.status = 404;
    throw error;
  }

  // Actualiza la configuración con los nuevos valores
  await config.update(valores);
  return config;
};

// Restablece la configuración de un usuario a los valores por defecto
const restablecerConfiguracion = async (usuario_id) => {
  // Busca la configuración del usuario
  let config = await Configuracion.findOne({ where: { usuario_id } });

  if (!config) {
    // Si no existe, la crea con los valores por defecto
    config = await Configuracion.create({
      usuario_id,
      ...DEFAULT_CONFIG,
    });
  } else {
    // Si existe, la actualiza con los valores por defecto
    await config.update(DEFAULT_CONFIG);
  }

  // Retorna la configuración restablecida
  return config;
};

// Exporta las funciones del servicio para ser usadas en otros módulos
module.exports = {
  crearConfiguracion,
  obtenerConfiguracion,
  actualizarConfiguracion,
  restablecerConfiguracion
};
