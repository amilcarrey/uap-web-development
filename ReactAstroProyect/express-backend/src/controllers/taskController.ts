import { Request, Response } from "express";
import {
  getAllTasks,
  createTask,
  removeTask,
  toggleTask,
  removeCompletedTasks,
  updateTask,
} from "../services/taskServices.js";

export const getTasksHandler = async (req: Request, res: Response) => {
  const { filtro, categoriaId } = req.query;

  try {
    const tasks = await getAllTasks(categoriaId as string, filtro as string);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const addTaskHandler = async (req: Request, res: Response) => {
  const { text, categoriaId } = req.body;

  try {
    await createTask(text, categoriaId);
    res.status(201).json({ message: "Tarea agregada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await removeTask(Number(id));
    res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const toggleTaskHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await toggleTask(Number(id));
    res.status(200).json({ message: "Estado de tarea actualizado" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const deleteCompletedTasksHandler = async (req: Request, res: Response) => {
  const { categoriaId } = req.body;

  try {
    await removeCompletedTasks(categoriaId);
    res.status(200).json({ message: "Tareas completadas eliminadas" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const editTaskHandler = async (req: Request, res: Response) => {
  const { id, text, categoriaId } = req.body;

  try {
    await updateTask(Number(id), text, categoriaId);
    res.status(200).json({ message: "Tarea editada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};