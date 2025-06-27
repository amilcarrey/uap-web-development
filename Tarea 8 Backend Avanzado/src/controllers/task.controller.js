const prisma = require("../../prisma/client");

exports.createTask = async (req, res) => {
  const { content, boardId } = req.body;
  const userId = req.user.id;

  const access = await prisma.boardAccess.findFirst({
    where: { boardId, userId }
  });

  if (!access || access.role === "VIEWER")
    return res.status(403).json({ error: "No autorizado" });

  const task = await prisma.task.create({
    data: { content, boardId }
  });

  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const { search = "", page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const tasks = await prisma.task.findMany({
    where: {
      boardId,
      content: { contains: search, mode: "insensitive" }
    },
    orderBy: { createdAt: "desc" },
    skip: parseInt(skip),
    take: parseInt(limit)
  });

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { content, completed } = req.body;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const access = await prisma.boardAccess.findFirst({
    where: { boardId: task.boardId, userId }
  });

  if (!access || access.role === "VIEWER")
    return res.status(403).json({ error: "No autorizado" });

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { content, completed }
  });

  res.json(updated);
};

exports.deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user.id;

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const access = await prisma.boardAccess.findFirst({
    where: { boardId: task.boardId, userId }
  });

  if (!access || access.role !== "OWNER" && access.role !== "EDITOR")
    return res.status(403).json({ error: "No autorizado" });

  await prisma.task.delete({ where: { id: taskId } });

  res.json({ message: "Tarea eliminada" });
};

exports.bulkDeleteCompleted = async (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const userId = req.user.id;

  const access = await prisma.boardAccess.findFirst({
    where: { boardId, userId }
  });

  if (!access || access.role !== "OWNER" && access.role !== "EDITOR")
    return res.status(403).json({ error: "No autorizado" });

  await prisma.task.deleteMany({
    where: { boardId, completed: true }
  });

  res.json({ message: "Tareas completadas eliminadas" });
};
