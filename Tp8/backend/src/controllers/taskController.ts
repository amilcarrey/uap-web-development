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

export const createTask = async (req: Request, res: Response) => {
  const { description, boardId } = req.body;

  const nueva = await prisma.task.create({
    data: {
      description,
      completed: false,
      boardId,
    },
  });

  res.json(nueva);
};
