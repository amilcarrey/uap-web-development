const Usuario = require('../models/Usuario');

// Obtiene todos los usuarios, excluyendo el campo 'contraseña'
exports.obtenerTodos = async () => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contraseña'] }
    });
    return usuarios;
  } catch (error) {
    throw error;
  }
};

// Obtiene un usuario por su ID, excluyendo el campo 'contraseña'
exports.obtenerPorId = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contraseña'] }
    });
    return usuario;
  } catch (error) {
    throw error;
  }
};

// Obtiene un usuario por su correo, excluyendo el campo 'contraseña'
exports.obtenerPorCorreo = async (correo) => {
  try {
    const usuario = await Usuario.findOne({
      where: { correo },
      attributes: { exclude: ['contraseña'] }
    });
    return usuario;
  } catch (error) {
    throw error;
  }
};

// Actualiza los datos de un usuario por su ID
exports.actualizarUsuario = async (id, datosActualizados) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return null; // Usuario no encontrado
    }
    // Actualiza solo los campos proporcionados en datosActualizados
    await usuario.update(datosActualizados);
    // Retorna el usuario actualizado sin la contraseña
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['contraseña'] }
    });
    return usuarioActualizado;
  } catch (error) {
    throw error;
  }
};

// Elimina un usuario por su ID
exports.eliminarUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return null; // Usuario no encontrado
    }
    await usuario.destroy(); // Elimina el registro
    return true; // Eliminación exitosa
  } catch (error) {
    throw error;
  }
};