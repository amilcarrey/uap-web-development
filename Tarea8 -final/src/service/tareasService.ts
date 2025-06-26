import { prisma } from "../prisma";
import { Permission } from "@prisma/client";

// Auxiliar: obtener el permiso del usuario sobre un board
export async function getUserPermission(boardId: string, userId: string): Promise<Permission | null> {
  return await prisma.permission.findUnique({
    where: {
      boardId_userId: { boardId, userId }
    }
  });
}

export async function getTareas(params: {
  filter?: string,
  page?: number,
  limit?: number,
  mode?: string,
  userId: string,
  search?: string
}) {
  const { filter, page = 1, limit = 5, mode = "personal", userId, search = "" } = params;
  const config = await prisma.userConfig.findUnique({ where: { userId } });

    const board = await prisma.board.findFirst({
    where: {
        OR: [
        { id: mode },
        { name: mode }
        ],
        permissions: { some: { userId } }
    },
    });

  if (!board) throw new Error("Tablero no encontrado");

  let taskWhere: any = { boardId: board.id };
  if (filter === "active") {
    taskWhere.completada = false;
  } else if (filter === "completed") {
    taskWhere.completada = true;
  }
  if (search) {
    taskWhere.text = { contains: search, mode: "insensitive" };
  }

  const total = await prisma.task.count({ where: taskWhere });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  let tasks = await prisma.task.findMany({
    where: taskWhere,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { id: "asc" }
  });

  if (config?.allTasksUppercase) {
    tasks = tasks.map(t => ({
      ...t,
      text: t.text.toUpperCase(),
    }));
  }

  return {
    tasks,
    total,
    totalPages,
    currentPage: page,
  };
}

// Servicio para manejar todas las acciones sobre tareas
export async function handleTareaAction(params: {
  action: string,
  task?: string,
  id?: string,
  mode?: string,
  userId: string
}) {
  const { action, task, id, mode = "personal", userId } = params;

  const config = await prisma.userConfig.findUnique({ where: { userId } });

  // CORREGIDO: buscar por id o name del board
  const board = await prisma.board.findFirst({
    where: {
      OR: [
        { id: mode },
        { name: mode }
      ],
      permissions: { some: { userId } }
    }
  });
  if (!board) throw new Error("Tablero no encontrado");

  const permission = await getUserPermission(board.id, userId);
  if (!permission) throw new Error("No tenés permiso para este tablero");

  // Solo "owner" o "editor" pueden agregar, modificar, borrar tareas
  if (["add", "toggle", "edit", "delete", "clear-completed", "clear-all"].includes(action)) {
    if (!["owner", "editor"].includes(permission.role)) {
      throw new Error("No tenés permiso para modificar tareas");
    }
  }

  if (action === "add" && task) {
    let texto = task;
    if (config?.allTasksUppercase) {
      texto = texto.toUpperCase();
    }
    if (!texto || texto.trim() === "") {
      throw new Error("El texto de la tarea no puede estar vacío");
    }
    await prisma.task.create({
      data: {
        text: texto,
        completada: false,
        boardId: board.id,
      }
    });
    return { success: true };
  }
  else if (action === "toggle" && id) {
    const tarea = await prisma.task.findFirst({ where: { id, boardId: board.id } });
    if (tarea) {
      await prisma.task.update({
        where: { id },
        data: { completada: !tarea.completada }
      });
      return { success: true };
    }
    throw new Error("Tarea no encontrada");
  }
  else if (action === "edit" && id && task) {
    const tarea = await prisma.task.findFirst({ where: { id, boardId: board.id } });
    if (tarea) {
      if (tarea.completada) {
        throw new Error("No se puede editar una tarea completada");
      }
      let texto = task;
      if (config?.allTasksUppercase) {
        texto = texto.toUpperCase();
      }
      await prisma.task.update({
        where: { id },
        data: { text: texto }
      });
      return { success: true };
    }
    throw new Error("Tarea no encontrada");
  }
  else if (action === "delete" && id) {
    await prisma.task.deleteMany({ where: { id, boardId: board.id } });
    return { success: true };
  }
  else if (action === "clear-completed") {
    await prisma.task.deleteMany({ where: { boardId: board.id, completada: true } });
    return { success: true };
  }
  else if (action === "clear-all") {
    await prisma.task.deleteMany({ where: { boardId: board.id } });
    return { success: true };
  }

  throw new Error("Bad Request");
}
