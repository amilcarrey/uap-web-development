import prisma from '../config/prismaClient';
import type { Task } from '@prisma/client';


// Obtener todas las tareas (opcionalmente filtradas por tablero)
export async function obtenerTareas(tableroId?: number) {
  return await prisma.task.findMany({
    where: tableroId ? { boardId: tableroId } : {},
    orderBy: { id: 'asc' },
  });
}

export async function eliminarTareasPorTablero(tableroId: number): Promise<number> {
  const result = await prisma.task.deleteMany({
    where: { boardId: tableroId },
  });

  return result.count; 
}

// Obtener una tarea específica
export async function obtenerTarea(id: number) {
  return await prisma.task.findUnique({ where: { id } });
}

// Agregar nueva tarea
export async function agregarTarea(descripcion: string, tableroId: number) {
  return await prisma.task.create({
    data: {
      title: descripcion,
      content: '', // Podés ajustar si querés más contenido
      boardId: tableroId,
    },
  });
}

// Editar descripción de la tarea
export async function editarTarea(id: number, nuevaDescripcion: string) {
  return await prisma.task.update({
    where: { id },
    data: { title: nuevaDescripcion },
  });
}

// Alternar estado completado 
export async function alternarEstado(id: number) {
  const tarea = await prisma.task.findUnique({ where: { id } });
  if (!tarea) throw new Error('Tarea no encontrada');

  return await prisma.task.update({
    where: { id },
    data: {
      completada: !tarea.completada
    },
  });
}


// Eliminar una tarea
export async function eliminarTarea(id: number) {
  return await prisma.task.delete({ where: { id } });
}

// Eliminar todas las tareas completadas de un tablero
export async function limpiarCompletadas(tableroId: number) {
  const result = await prisma.task.deleteMany({
    where: {
      boardId: tableroId,
      completada: true
    },
  });
  return result.count;
}


// Obtener tareas filtradas
export async function obtenerFiltrado(tableroId?: number, filtro: "all" | "complete" | "incomplete" = "all") {
  let where: any = { boardId: tableroId };

  if (filtro === "complete") where.completada = true;
  if (filtro === "incomplete") where.completada = false;

  return await prisma.task.findMany({ where });
}


export function renderTareas(tareasFiltradas: Task[]): string {
  if (tareasFiltradas.length === 0) {
    return `<p class="text-center text-gray-600">Sin tareas.</p>`;
  }

  return tareasFiltradas.map(tarea => `
    <div class="flex items-center justify-between bg-orange-50 p-3 rounded mb-3 ${tarea.completada ? 'line-through text-gray-500' : ''}">
      <form method="POST" action="/api/tareas/toggle" class="inline">
        <input type="hidden" name="id" value="${tarea.id}" />
        <button type="submit" class="text-xl">${tarea.completada ? '🔄' : '✔️'}</button>
      </form>
      <span class="flex-1 mx-4">${tarea.title}</span>
      <form method="POST" action="/api/tareas/delete" class="inline">
        <input type="hidden" name="id" value="${tarea.id}" />
        <button type="submit" class="text-xl">🗑️</button>
      </form>
    </div>
  `).join('');
}
