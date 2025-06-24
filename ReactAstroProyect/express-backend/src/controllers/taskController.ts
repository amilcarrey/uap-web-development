import { Request, Response, NextFunction } from "express";
import {
  getAllTasks,
  createTask,
  removeTask,
  toggleTask,
  removeCompletedTasks,
  updateTask,
  listarTareasPaginadasService as listarTareasPaginadas,
  getTaskById,
} from "../services/taskServices.js";
import { checkCategoryPermissionService } from "../services/categoryServices.js";


export async function hasAnyPermission(categoryId: string, userId: string, roles: string[]): Promise<boolean> {
  for (const role of roles) {
    const hasPermission = await checkCategoryPermissionService(categoryId, userId, role);
    if (hasPermission) {
      return true;
    }
  }
  return false;
}

export const getTasksHandler = async (req: Request, res: Response) => {
  const { filtro, categoriaId, page = 1, pageSize = 7, search } = req.query; // Agregar search

  try {
    const { tasks, totalCount } = await listarTareasPaginadas(
      Number(page),
      Number(pageSize),
      categoriaId as string,
      filtro as "completadas" | "pendientes",
      search as string 
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
  const user = req.user as { id: string };

  try {
    const hasPermission = await hasAnyPermission(categoriaId, user.id, ["editor", "owner"]);
    if (!hasPermission) {
      res.status(403).json({ error: "No tienes permisos para agregar tareas en esta categoría." });
      return;
    }

    await createTask(text, categoriaId);
    res.status(201).json({ message: "Tarea agregada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const { id } = req.params; 
  const user = req.user as { id: string }; // Usuario autenticado

  try {

      const task = await getTaskById(Number(id)); 
    if (!task) {
       res.status(404).json({ error: "Tarea no encontrada" });
       return; // corta la ejecución
    }

    // Verificar si el usuario tiene permisos como `editor` u `owner`
    const hasPermission = await hasAnyPermission(task.categoriaId, user.id, ["editor", "owner"]);
    if (!hasPermission) {
      res.status(403).json({ error: "No tienes permisos para eliminar esta tarea." });
      return; // corta la ejecución
    }


    await removeTask(Number(id));
    res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const toggleTaskHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as { id: string }; // Usuario autenticado

  try {
        const task = await getTaskById(Number(id));
    if (!task) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

      const hasPermission = await hasAnyPermission(task.categoriaId, user.id, ["editor", "owner"]);
    if (!hasPermission) {
      res.status(403).json({ error: "No tienes permisos para cambiar el estado de esta tarea." });
      return;
    }
    await toggleTask(Number(id));
    res.status(200).json({ message: "Estado de tarea actualizado" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};


export const deleteCompletedTasksHandler = async (req: Request, res: Response) => {
  const { categoriaId } = req.query;
  const user = req.user as { id: string };

  try {
    const hasPermission = await hasAnyPermission(categoriaId as string, user.id, ["editor", "owner"]);
    if (!hasPermission) {
      res.status(403).json({ error: "No tienes permisos para eliminar tareas completadas en esta categoría." });
      return;
    }

    await removeCompletedTasks(categoriaId as string);
    res.status(200).json({ message: "Tareas completadas eliminadas" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};


export const editTaskHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, categoriaId } = req.body;
  const user = req.user as { id: string };

  try {
    const hasPermission = await hasAnyPermission(categoriaId, user.id, ["editor", "owner"]);
    if (!hasPermission) {
      res.status(403).json({ error: "No tienes permisos para editar esta tarea." });
      return;
    }

    await updateTask(Number(id), text, categoriaId);
    res.status(200).json({ message: "Tarea editada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};