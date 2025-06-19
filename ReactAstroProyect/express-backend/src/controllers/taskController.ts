import { Request, Response, NextFunction } from "express";
import {
  getAllTasks,
  createTask,
  removeTask,
  toggleTask,
  removeCompletedTasks,
  updateTask,
  listarTareasPaginadasService as listarTareasPaginadas,
} from "../services/taskServices.js";

export const getTasksHandler = async (req: Request, res: Response) => {
  const { filtro, categoriaId, page = 1, pageSize = 7 } = req.query;

  try {
    const { tasks, totalCount } = await listarTareasPaginadas(
      Number(page),
      Number(pageSize),
      categoriaId as string,
      filtro as "completadas" | "pendientes"
    );

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.status(200).json({ tasks, totalPages, totalCount });
  } catch (error) {
    console.error("Error en GET /api/tasks:", error);
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


export const deleteCompletedTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoriaId } = req.query;

    console.log("categoriaId recibido en deleteCompletedTasksHandler:", categoriaId);

  if (typeof categoriaId !== "string" || !categoriaId.trim()) {
    res.status(400).json({ error: "categoriaId es requerido" });
    return;  // corta la ejecución, retorna void
  }

  try {
    await removeCompletedTasks(categoriaId);
    res.status(200).json({ message: "Tareas completadas eliminadas" });
  } catch (error) {
    next(error); 
  }
};

export const editTaskHandler = async (req: Request, res: Response) => {
   const { id } = req.params; // Obtener el ID de la tarea desde la URL
  const { text, categoriaId } = req.body; // Obtener los datos del cuerpo de la solicitud

  try {
    await updateTask(Number(id), text, categoriaId);
    res.status(200).json({ message: "Tarea editada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};