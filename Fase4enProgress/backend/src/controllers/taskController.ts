import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const getTasks = async (req: Request, res: Response) => {
  const { boardId, page = 1, limit = 5 } = req.query;

  const tareas = await prisma.task.findMany({
    where: { boardId: boardId as string },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { createdAt: "desc" },
  });

  res.json(tareas);
};


export const createTask = async (req: Request, res: Response): Promise<void> => {
  console.log("req.body en createTask:", req.body);

  const { description, boardId } = req.body;

  if (
    !description || typeof description !== "string" || description.trim() === "" ||
    !boardId || typeof boardId !== "string"
  ) {
    res.status(400).json({ error: "Faltan campos obligatorios o son inválidos" });
    return;
  }

  try {
    const nueva = await prisma.task.create({
      data: {
        description: description.trim(),
        completed: false,
        boardId,
      },
    });

    res.json(nueva);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



//obtener todas las tareas sin paginacion
export const getAllTasks = async (req: Request, res: Response) => {
  const { boardId } = req.query;

  if (!boardId || typeof boardId !== "string") {
    return res.status(400).json({ error: "Falta el boardId" });
  }

  const tareas = await prisma.task.findMany({
    where: { boardId },
    orderBy: { createdAt: "desc" },
  });

  res.json(tareas);
};


//marcar tarea como completada/incompleta
export const toggleTaskCompletion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const tarea = await prisma.task.findUnique({ where: { id } });
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  const actualizada = await prisma.task.update({
    where: { id },
    data: { completed: !tarea.completed },
  });

  res.json(actualizada);
};

//editar descripción
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "La descripción es obligatoria" });
  }

  const actualizada = await prisma.task.update({
    where: { id },
    data: { description: description.trim() },
  });

  res.json(actualizada);
};

//borrar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.task.delete({ where: { id } });
  res.status(204).send(); // No content
};

export const deleteCompletedTasks = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const userId = req.user?.id;

  if (!boardId || !userId) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    // Borra todas las tareas completadas del tablero
    await prisma.task.deleteMany({
      where: {
        boardId,
        completed: true,
      },
    });

    res.json({ message: 'Tareas completadas eliminadas exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al eliminar tareas completadas' });
  }
};