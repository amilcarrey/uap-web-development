import { prisma } from "../prisma";

export const createBoard = async (name: string, userId: string) => {
  if (!name) throw new Error("Falta el nombre del tablero");

  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
        permissions: {
          create: [{ userId, role: "owner" }]
        }
      }
    });
    return board;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Ya tienes un tablero con ese nombre");
    }
    throw new Error("Error al crear el tablero");
  }
};

export const getMyBoards = async (userId: string) => {
  const boards = await prisma.board.findMany({
    where: {
      permissions: {
        some: { userId }
      }
    },
    include: {
      permissions: true,
      tasks: true,
      owner: { select: { username: true, id: true } }
    }
  });
  return boards;
};

export const shareBoard = async (boardId: string, targetUsername: string, role: string, userId: string) => {
  // Verificar que el user sea owner del board
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { permissions: true }
  });

  if (!board || board.ownerId !== userId) {
    throw new Error("No tenés permiso para compartir este tablero");
  }

  // Buscar el usuario a compartir
  const targetUser = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!targetUser) throw new Error("Usuario no encontrado");

  // Crear o actualizar permiso
  await prisma.permission.upsert({
    where: {
      boardId_userId: { boardId, userId: targetUser.id }
    },
    create: {
      boardId,
      userId: targetUser.id,
      role
    },
    update: { role }
  });

  return { message: "Permiso actualizado" };
};

export const getBoardPermissions = async (boardId: string, userId: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) {
    throw new Error("No autorizado");
  }

  const permissions = await prisma.permission.findMany({
    where: { boardId },
    include: { user: { select: { id: true, username: true } } }
  });

  return permissions;
};

export const updateBoardPermission = async (boardId: string, targetUserId: string, role: string, userId: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) throw new Error("No autorizado");

  if (targetUserId === userId) throw new Error("No podés cambiar tu propio rol de owner");

  const permission = await prisma.permission.findUnique({
    where: { boardId_userId: { boardId, userId: targetUserId } }
  });

  if (!permission) throw new Error("Permiso no encontrado");

  await prisma.permission.update({
    where: { boardId_userId: { boardId, userId: targetUserId } },
    data: { role }
  });

  return { message: "Permiso actualizado" };
};


export const removeBoardPermission = async (boardId: string, targetUserId: string, userId: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) {
    throw new Error("No autorizado");
  }

  if (targetUserId === userId) {
    throw new Error("No podés quitarte a vos mismo (owner)");
  }

  await prisma.permission.delete({
    where: { boardId_userId: { boardId, userId: targetUserId } }
  });

  return { message: "Permiso eliminado" };
};

export const deleteBoard = async (boardId: string, userId: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.ownerId !== userId) {
    throw new Error("No autorizado");
  }

  await prisma.board.delete({ where: { id: boardId } });
  return { message: "Tablero eliminado" };
};
