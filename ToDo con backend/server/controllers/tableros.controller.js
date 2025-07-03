import {
  crearTableroService,
  obtenerTablerosService,
  obtenerTableroPorIdService,
  eliminarTableroService,
} from "../servieces/tableroServieces.js";

import { compartirTableroService } from "../servieces/compartirTableroServiece.js";
import { obtenerTablerosCompartidosServieces } from "../servieces/compartirTableroServiece.js";

export async function crearTablero(req, res) {
  const { name, nombre } = req.body;
  const tableroName = name || nombre; // Acepta ambos
  const userId = req.user.id;

  console.log(" Creando tablero:", { tableroName, userId });

  if (!tableroName) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    const tablero = await crearTableroService({ name: tableroName, userId });
    console.log(" Tablero creado:", tablero);
    res.status(201).json({ message: "Tablero creado con éxito", tablero });
  } catch (error) {
    console.error("Error en crearTablero:", error);
    res
      .status(500)
      .json({ message: "Error al crear el tablero", error: error.message });
  }
}

export async function obtenerTableros(req, res) {
  try {
    const userId = req.user.id;
    const tableros = await obtenerTablerosService(userId);
    res.status(200).json({ tableros });
  } catch (error) {
    console.error("Error en obtenerTableros:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los tableros", error: error.message });
  }
}

export async function obtenerTableroPorId(req, res) {
  const { id } = req.params;

  obtenerTableroPorIdService(id)
    .then((tablero) => {
      if (!tablero) {
        return res.status(404).json({ message: "Tablero no encontrado" });
      }
      res.status(200).json({ tablero });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener el tablero", error });
    });
}

export function eliminarTablero(req, res) {
  const { id } = req.params;

  eliminarTableroService(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Tablero no encontrado" });
      }
      res.status(200).json({ message: "Tablero eliminado con éxito" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al eliminar el tablero", error });
    });
}

export async function compartirTablero(req, res) {
  const { tableroId, usuarioEmail, rol } = req.body;
  const propietarioId = req.user.id;

  if (!tableroId || !usuarioEmail || !rol) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    await compartirTableroService(tableroId, propietarioId, usuarioEmail, rol);
    res.status(200).json({ message: "Tablero compartido con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al compartir el tablero",
      error: error.message,
    });
  }
}

export async function obtenerTablerosCompartidos(req, res) {
  const usuarioId = req.user.id;

  try {
    const tablerosCompartidos = await obtenerTablerosCompartidosServieces(
      usuarioId
    );
    res.status(200).json({ tablerosCompartidos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los tableros compartidos", error });
  }
}
