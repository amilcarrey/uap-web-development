const Task = require('../models/Task');

// Obtener todas las tareas del usuario y board, con paginación
exports.getAll = async (req, res) => {
  const { boardId, category, page = 1, pageSize = 5 } = req.query;
  const where = { userId: req.user.id };
  if (boardId) where.boardId = boardId;
  if (category) where.category = category;

  const limit = parseInt(pageSize, 10) || 5;
  const offset = ((parseInt(page, 10) || 1) - 1) * limit;

  const { rows: tasks, count: total } = await Task.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    tasks,
    total,
    page: parseInt(page, 10) || 1,
    pageSize: limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
};

// Crear tarea
exports.createTask = async (req, res) => {
  const { text, category, boardId } = req.body;
  const task = await Task.create({
    text,
    category,
    boardId,
    userId: req.user.id,
    completed: false,
  });
  res.status(201).json(task);
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { text, completed, category } = req.body;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;
  if (category !== undefined) task.category = category;

  await task.save();
  res.json(task);
};

// Borrar tarea
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  await task.destroy();
  res.status(204).end();
};

// Borrar todas las tareas completadas de un board para el usuario actual
exports.clearCompleted = async (req, res) => {
  try {
    const boardId = Number(req.params.boardId); // <-- fuerza a número
    const userId = req.user.id;
    await Task.destroy({
      where: {
        completed: true,
        boardId,
        userId,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar tareas completadas' });
  }
};