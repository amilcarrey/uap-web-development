import prisma from '../config/prismaClient';

export const agregarTableroService = async (nombre: string, userId: number) => {
  const nuevoTablero = await prisma.board.create({
    data: {
      name: nombre,
      ownerId: userId,
    },
  });
  return nuevoTablero;
};

export const eliminarTableroService = async (boardId: number, userId: number) => {
  const tablero = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!tablero || tablero.ownerId !== userId) {
    return false;
  }

  await prisma.board.delete({
    where: { id: boardId },
  });

  return true;
};

export async function obtenerTablerosService(userId: number) {
  const tableros = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { boardUsers: { some: { userId: userId } } }
      ]
    },
    include: {
      boardUsers: true,
    },
  });

  return tableros;
}


export const obtenerTableroService = async (boardId: number, userId: number) => {
  const tablero = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!tablero || tablero.ownerId !== userId) {
    return null;
  }

  return tablero;
};
