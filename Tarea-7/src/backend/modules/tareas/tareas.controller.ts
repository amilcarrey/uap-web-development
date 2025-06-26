import { Request, Response } from "express";
import { TareasService } from "./tareas.service";
import { CreateTareaRequest, UpdateTareaRequest } from "../../types";

export const getTareas = async (req: Request, res: Response): Promise<void> => {
  const { tableroId, page = "1", pageSize = "10" } = req.query;

  if (!tableroId || typeof tableroId !== "string") {
    res.status(400).json({ error: "Falta el parámetro 'tableroId'" });
    return;
  }

  const pageNum = parseInt(page as string);
  const pageSizeNum = parseInt(pageSize as string);
  const offset = (pageNum - 1) * pageSizeNum;

  const [tareas, total] = await Promise.all([
    TareasService.getPaginated(tableroId, pageSizeNum, offset),
    TareasService.getCount(tableroId),
  ]);

  res.json({
    tareas,
    total,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(total / pageSizeNum),
  });
};


export const getTareaPorId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const tarea = await TareasService.getById(id);

  if (!tarea) {
    res.status(404).json({ error: "Tarea no encontrada" });
    return;
  }

  res.json(tarea);
};

import { NextFunction } from "express";

export const createTarea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateTareaRequest;

    if (!data.content || !data.tableroId) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const id = await TareasService.create(data);
    res.status(201).json({ id });
  } catch (error) {
    console.error("💥 Error en createTarea:", error);
    next(error); 
  }
};


export const updateTarea = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const data = req.body as UpdateTareaRequest;
  data.id = id;

  const changes = await TareasService.update(data);
  res.json({ changes });
};

export const deleteTarea = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const changes = await TareasService.delete(id);
  res.json({ deleted: changes });
};
