import { Request, Response } from "express";
import { TableroService } from "./tableros.service";
import { CreateTableroRequest } from "../../types";
import { TableroRepository } from "./tableros.repository";


const repo = new TableroRepository();
const service = new TableroService(repo);

export const getAllTableros = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const tableros = await service.getAll(userId);
  res.status(200).json(tableros);
};

export const getTableroById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const tablero = await service.getById(id);
  if (!tablero) {
    res.status(404).json({ error: "Tablero no encontrado" });
    return;
  }
  res.json({ tablero });
};

export const createTablero = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as CreateTableroRequest;
  const ownerId = req.user?.userId;
  if (!data.nombre || !ownerId) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  const nuevo = await service.create({ ...data, ownerId });
  res.status(201).json({ tablero: nuevo });
};

export const deleteTablero = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const exists = await service.exists(id);
  if (!exists) {
    res.status(404).json({ error: "Tablero no encontrado" });
    return;
  }

  await service.delete(id);
  res.status(204).send();
};
