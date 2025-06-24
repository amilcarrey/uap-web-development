import { Request, Response } from "express";
import { obtenerTareas } from "./tarea.model";
import { createTarea } from "./tarea.service";
import db from "../../db/knex";

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

export const agregarTarea = async (req: Request, res: Response) => {
  try {
    const { texto, tableroId } = req.body;
    const nuevaTarea = await createTarea(texto, tableroId); // <-- devuelve la tarea creada
    res.status(201).json(nuevaTarea); // <-- responde la tarea creada
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Faltan campos o datos inválidos" });
  }
};
