// server/controllers/tableros.controller.js

import {
  obtenerTablerosService,
  obtenerTableroPorIdService,
  crearTableroService,
  actualizarTableroService,
  eliminarTableroService
} from '../servieces/tableroServieces.js';

import {
  compartirTableroService
} from '../servieces/permisoServieces.js';

// Obtener todos los tableros
export const obtenerTableros = async (req, res) => {
  try {
    // Obtengo todos los tableros donde este usuario tiene permisos
    const tableros = await obtenerTablerosService(req.usuario.id);
    res.status(200).json(tableros);
  } catch (error) {
    console.error("Error al obtener los tableros:", error);
    res.status(500).json({ message: "Error al obtener los tableros" });
  }
};

// Obtener tablero por ID
export const obtenerTableroPorId = async (req, res) => {
  try {
    const tablero = await obtenerTableroPorIdService(req.params.id);
    if (tablero) {
      res.status(200).json(tablero);
    } else {
      res.status(404).json({ message: "Tablero no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el tablero:", error);
    res.status(500).json({ message: "Error al obtener el tablero" });
  }
};

// Crear tablero (y permiso de propietario)
export const crearTablero = async (req, res) => {
  try {
    const propietario_id = req.usuario.id;
    const { nombre, descripcion } = req.body;

    // Validaciones básicas antes de intentar crear
    if (!nombre) {
      return res.status(400).json({ message: "El nombre del tablero es requerido" });
    }

    if (!propietario_id) {
      return res.status(400).json({ message: "Usuario no autenticado correctamente" });
    }

    // 1) Creo el tablero en la base de datos
    const tablero = await crearTableroService({ nombre, descripcion, propietario_id });

    // 2) Creo el permiso de propietario explícitamente
    const permiso = await compartirTableroService(tablero.id, propietario_id, 'propietario');

    return res.status(201).json({
      message: "Tablero y permiso creados exitosamente",
      tablero,
      permiso
    });
  } catch (error) {
    if (error.message === "Faltan datos requeridos") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error al crear el tablero:", error);
    return res.status(500).json({ message: "Error al crear el tablero" });
  }
};

// Actualizar tablero
export const actualizarTablero = async (req, res) => {
  try {
    const tableroActualizado = await actualizarTableroService(req.params.id, req.body);
    if (tableroActualizado) {
      res.status(200).json({ message: "Tablero actualizado exitosamente", tablero: tableroActualizado });
    } else {
      res.status(404).json({ message: "Tablero no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el tablero:", error);
    res.status(500).json({ message: "Error al actualizar el tablero" });
  }
};

// Eliminar tablero
export const eliminarTablero = async (req, res) => {
  try {
    const eliminado = await eliminarTableroService(req.params.id);
    if (eliminado) {
      res.status(200).json({ message: "Tablero eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Tablero no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el tablero:", error);
    res.status(500).json({ message: "Error al eliminar el tablero" });
  }
};
