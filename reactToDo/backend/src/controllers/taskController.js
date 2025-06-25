const Task = require('../models/Task');

// Obtener todas las tareas del usuario y board
exports.getAll = async (req, res) => {
  const { boardId, category } = req.query;
  const where = { userId: req.user.id };
  if (boardId) where.boardId = boardId;
  if (category) where.category = category;
  const tasks = await Task.findAll({ where });
  res.json(tasks);
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