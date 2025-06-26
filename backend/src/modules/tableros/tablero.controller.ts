import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getTablerosByUser,
  createTablero,
  deleteTablero,
  compartirTablero,
  obtenerUsuariosCompartidos,
  eliminarColaborador,
} from "./tablero.service";
import db from "../../db/knex";
import { obtenerRolUsuario } from "../../utils/permisos";

export const listarTableros = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) throw new Error("No autenticado");
    const tableros = await getTablerosByUser(userId);
    console.log(tableros); // <-- ¿Ves "propietario" aquí?
    res.json(tableros);
  } catch (error) {
    if (error instanceof Error && error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al obtener tableros" });
    }
  }
};

export const agregarTablero = async (req: AuthRequest, res: Response) => {
  try {
    const { nombre } = req.body;
    const userId = req.userId;
    if (!userId) throw new Error("No autenticado");
    const nuevoTablero = await createTablero(nombre, userId);
    res.status(201).json(nuevoTablero);
  } catch (error) {
    if (error instanceof Error && error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al crear tablero" });
    }
  }
};

export const borrarTablero = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await deleteTablero(String(id));
    if (deleted) {
      res.json({ mensaje: "Tablero eliminado" });
    } else {
      res.status(404).json({ error: "Tablero no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tablero" });
  }
};

export const compartir = async (req: AuthRequest, res: Response) => {
  const { tableroId } = req.params;
  const { nombreUsuario, rol } = req.body;
  const userId = req.userId;

  try {
    // Verifica que el userId es propietario del tablero
    const permiso = await db("tablero_usuarios")
      .where({ tablero_id: tableroId, usuario_id: userId })
      .first();
    if (!permiso || permiso.rol !== "propietario") {
      throw new Error("Solo el propietario puede compartir el tablero");
    }

    // Busca el usuario a compartir por nombre
    const usuario = await db("users")
      .where({ nombre: nombreUsuario })
      .first();
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    await compartirTablero(tableroId, usuario.id, rol);
    res.json({ mensaje: "Usuario agregado correctamente" });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Solo el propietario puede compartir el tablero"
    ) {
      res.status(403).json({ error: error.message });
    } else if (
      error instanceof Error &&
      error.message === "Usuario no encontrado"
    ) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al compartir tablero" });
    }
  }
};

export const listarUsuariosCompartidos = async (
  req: AuthRequest,
  res: Response
) => {
  const { tableroId } = req.params;
  const usuarios = await obtenerUsuariosCompartidos(tableroId);
  res.json(usuarios);
};

export const obtenerRol = async (req: AuthRequest, res: Response) => {
  try {
    const { tableroId } = req.params;
    const userId = req.userId;
    if (!userId) throw new Error("No autenticado");
    const rol = await obtenerRolUsuario(tableroId, userId);
    if (!rol) throw new Error("No tienes acceso a este tablero");
    res.json({ rol });
  } catch (error) {
    if (error instanceof Error && error.message === "No autenticado") {
      res.status(401).json({ error: error.message });
    } else if (error instanceof Error && error.message === "No tienes acceso a este tablero") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al obtener rol" });
    }
  }
};

export const eliminarColaboradorController = async (req: AuthRequest, res: Response) => {
  const { tableroId, usuarioId } = req.params;
  const userId = req.userId;
  try {
    const permiso = await db("tablero_usuarios")
      .where({ tablero_id: tableroId, usuario_id: userId })
      .first();

    // Lanza error si no es propietario
    if (!permiso || permiso.rol !== "propietario") {
      throw new Error("Solo el propietario puede eliminar colaboradores");
    }

    await eliminarColaborador(tableroId, usuarioId);
    res.json({ mensaje: "Colaborador eliminado" });
  } catch (error: any) {
    if (error.message === "Solo el propietario puede eliminar colaboradores") {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Error al eliminar colaborador" });
    }
  }
};
