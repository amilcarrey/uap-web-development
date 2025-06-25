import { Request, Response } from "express";
import { createTarea, deleteTarea, updateTarea, getAllTareas, toggleCompletada, deleteCompletadas, completarTareaPorId, getTareaById } from "./tarea.service";
import db from "../../db/knex";
import { AuthRequest } from "../../middleware/auth.middleware";
import { obtenerRolUsuario } from "../../utils/permisos";

export const listarTareas = async (req: Request, res: Response) => {
  try {
    const tableroId = (req.query.tableroId || req.query.tablero_id) as string;
    const pagina = parseInt(req.query.pagina as string) || 1;
    const porPagina = parseInt(req.query.porPagina as string) || 3;

    if (!tableroId) {
      throw new Error("Falta tableroId");
    }

    const total = await db("tareas").where({ tableroId }).count<{ count: number }>("id as count").first();
    const tareas = await db("tareas")
      .where({ tableroId })
      .limit(porPagina)
      .offset((pagina - 1) * porPagina)
      .select("*");

    res.json({
      tareas,
      total: total?.count ?? 0,
      pagina,
      porPagina,
      totalPaginas: Math.max(1, Math.ceil((total?.count ?? 0) / porPagina)),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al obtener tareas";
    res.status(400).json({ error: errorMessage });
  }
};

export const agregarTarea = async (req: AuthRequest, res: Response) => {
  try {
    const { texto, tableroId } = req.body;
    const userId = req.userId;

    if (!tableroId || typeof tableroId !== "string") {
      throw new Error("Falta el parámetro tableroId");
    }
    if (!userId) {
      throw new Error("No autenticado");
    }

    const rol = await obtenerRolUsuario(tableroId, userId);
    if (!rol || (rol !== "editor" && rol !== "propietario")) {
      throw new Error("No tienes permisos para agregar tareas");
    }

    const nuevaTarea = await createTarea(texto, tableroId);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Faltan campos o datos inválidos";
    let status = 400;
    if (errorMessage === "No autenticado") status = 401;
    if (errorMessage === "No tienes permisos para agregar tareas") status = 403;
    res.status(status).json({ error: errorMessage });
  }
};
export const borrarTareasCompletadas = async (req: AuthRequest, res: Response) => {
  try {
    const { tableroId } = req.query;
    const userId = req.userId;
    if (!tableroId) {
      throw new Error("Falta el parámetro tableroId");
    }
    if (!userId) {
      throw new Error("No autenticado");
    }
    const rol = await obtenerRolUsuario(tableroId as string, userId);
    if (!rol || (rol !== "editor" && rol !== "propietario")) {
      throw new Error("No tienes permisos para eliminar tareas completadas");
    }
    const deleted = await deleteCompletadas(tableroId as string);
    res.json({ mensaje: "Tareas completadas eliminadas", deleted });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar tareas completadas";
    let status = 400;
    if (errorMessage === "No autenticado") status = 401;
    if (errorMessage === "No tienes permisos para eliminar tareas completadas") status = 403;
    res.status(status).json({ error: errorMessage });
  }
};


export const borrarTarea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tarea = await getTareaById(id);
    if (!tarea || typeof tarea.tableroId !== "string") {
      throw new Error("Tarea no encontrada");
    }
    const rol = await obtenerRolUsuario(tarea.tableroId, req.userId as string);
    if (!rol || (rol !== "editor" && rol !== "propietario")) {
      throw new Error("No tienes permisos para eliminar tareas");
    }
    const deleted = await deleteTarea(id);
    if (deleted) {
      res.json({ mensaje: "Tarea eliminada" });
    } else {
      throw new Error("Tarea no encontrada");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar tarea";
    let status = 500;
    if (errorMessage === "Tarea no encontrada") status = 404;
    if (errorMessage === "No tienes permisos para eliminar tareas") status = 403;
    res.status(status).json({ error: errorMessage });
  }
};
export const modificarTarea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const datos = req.body;

    const tarea = await getTareaById(id);
    if (!tarea || typeof tarea.tableroId !== "string") {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const rol = await obtenerRolUsuario(tarea.tableroId as string, userId as string);
    if (!rol || (rol !== "editor" && rol !== "propietario")) {
      res.status(403).json({ error: "No tienes permisos para modificar tareas" });
      return;
    }

    const tareaActualizada = await updateTarea(id, datos);
    if (tareaActualizada) {
      res.json(tareaActualizada);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al modificar tarea" });
  }
};

export const completarTarea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new Error("No autenticado");
    }

    const tarea = await getTareaById(id);
    if (!tarea) {
      throw new Error("Tarea no encontrada");
    }
    if (!tarea.tableroId || typeof tarea.tableroId !== "string") {
      throw new Error("La tarea no tiene un tableroId válido");
    }

    const rol = await obtenerRolUsuario(tarea.tableroId, userId);
    if (!rol || (rol !== "editor" && rol !== "propietario")) {
      throw new Error("No tienes permisos para completar tareas");
    }

    const tareaActualizada = await completarTareaPorId(id);
    res.json(tareaActualizada);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al completar la tarea";
    let status = 500;
    if (errorMessage === "No autenticado") status = 401;
    else if (errorMessage === "Tarea no encontrada") status = 404;
    else if (errorMessage === "No tienes permisos para completar tareas") status = 403;
    else if (errorMessage === "La tarea no tiene un tableroId válido") status = 400;
    res.status(status).json({ error: errorMessage });
  }
};
