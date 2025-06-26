import prisma from '../config/prismaClient';

export const agregarTareaService = async (descripcion: string, boardId: number) => {
  return prisma.task.create({
    data: {
      title: descripcion,
      content: "",
      boardId,
    },
  });
};

export const eliminarTareaService = async (taskId: number) => {
  return prisma.task.delete({
    where: { id: taskId },
  });
};

export const editarTareaService = async (taskId: number, descripcion: string) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { title: descripcion },
  });
};

export const alternarEstadoService = async (taskId: number) => {
  const tarea = await prisma.task.findUnique({ where: { id: taskId } });
  if (!tarea) return null;

  return prisma.task.update({
    where: { id: taskId },
    data: { completada: !tarea.completada },
  });
};

export const obtenerTareaService = async (taskId: number) => {
  return prisma.task.findUnique({
    where: { id: taskId },
  });
};

export const limpiarCompletadasService = async (boardId: number) => {
  const eliminadas = await prisma.task.deleteMany({
    where: {
      boardId,
      completada: true,
    },
  });
  return eliminadas.count;
};

export const obtenerFiltradoService = async (boardId: number, filter: 'all' | 'complete' | 'incomplete') => {
  const where: any = { boardId };

  if (filter === 'complete') where.completada = true;
  if (filter === 'incomplete') where.completada = false;

  return prisma.task.findMany({ where });
};
