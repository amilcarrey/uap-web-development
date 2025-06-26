import prisma from '../config/prismaClient';
import { Role } from '@prisma/client';  

export const assignBoardPermission = async (
  ownerId: number,
  boardId: number,
  targetUserId: number,
  role: Role 
) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw { status: 404, message: 'Tablero no encontrado' };
  }

  if (board.ownerId !== ownerId) {
    throw { status: 403, message: 'No tienes permiso para asignar roles en este tablero' };
  }

  const boardUser = await prisma.boardUser.upsert({
    where: {
      boardId_userId: {
        boardId,
        userId: targetUserId,
      },
    },
    update: { role },  
    create: {
      boardId,
      userId: targetUserId,
      role,
    },
  });

  return boardUser;
};
