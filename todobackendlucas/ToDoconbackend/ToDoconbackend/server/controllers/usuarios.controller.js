import {
  obtenerUsuariosService,
  obtenerUsuarioPorIdService,
  crearUsuarioService,
  actualizarUsuarioService,
  eliminarUsuarioService
} from '../servieces/usuarioServieces.js';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosService();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorIdService(req.params.id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await crearUsuarioService(req.body);
    res.status(201).json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    if (error.message === "Faltan datos requeridos") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await actualizarUsuarioService(req.params.id, req.body);
    if (usuarioActualizado) {
      res.status(200).json({ message: "Usuario actualizado exitosamente", usuario: usuarioActualizado });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await eliminarUsuarioService(req.params.id);
    if (eliminado) {
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
}


