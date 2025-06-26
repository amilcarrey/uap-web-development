import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';

export const createBoard = async (req: Request, res: Response) => {
  const { title } = req.body;

  const board = await prisma.board.create({
    data: {
      title,
      ownerId: req.user!.id,
      permissions: {
        create: {
          userId: req.user!.id,
          role: 'owner',
        },
      },
    },
  });

  res.json(board);
};

export const getBoards = async (req: Request, res: Response) => {
  const boards = await prisma.board.findMany({
    where: {
      permissions: {
        some: {
          userId: req.user!.id,
        },
      },
    },
  });

  res.json(boards);
};

export const shareBoard = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    const boardId = req.params.id;

    await prisma.boardPermission.create({
      data: {
        userId,
        boardId,
        role,
      },
    });

    res.json({ message: 'Tablero compartido exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  const userId = req.user?.id;

  try {
    await prisma.boardPermission.deleteMany({
      where: { boardId },
    });

    await prisma.board.delete({
      where: { id: boardId },
    });

    res.json({ message: "Tablero eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tablero" });
  }
};

