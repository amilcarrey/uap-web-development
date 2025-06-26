import prisma from '../config/prismaClient';

export async function obtenerTableros(userId: number) {
  return await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          boardUsers: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
  });
}

// Obtener un tablero por ID
export async function obtenerTablero(id: number) {
  return await prisma.board.findUnique({
    where: { id },
    include: { tasks: true },
  });
}

// Agregar un nuevo tablero
export async function agregarTablero(nombre: string, ownerId: number) {
  return await prisma.board.create({
    data: {
      name: nombre,
      ownerId: ownerId,
    },
  });
}

// Eliminar un tablero (y sus tareas)
export async function eliminarTablero(id: number, userId: number): Promise<boolean> {
  const board = await prisma.board.findUnique({ where: { id } });

  if (!board || board.ownerId !== userId) {
    return false; // no existe o no es dueño
  }

  //await eliminarTareasPorTablero(id); ya eliminamos las tareas asociadas al tablero, al borrarlo directamnte.

  // Eliminar tablero
  await prisma.board.delete({ where: { id } });

  return true;
}
