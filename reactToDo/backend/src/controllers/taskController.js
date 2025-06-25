const Task = require('../models/Task');

exports.getAll = async (req, res) => {
  const { boardId, category } = req.query;
  const where = { userId: req.user.id };
  if (boardId) where.boardId = boardId;
  if (category) where.category = category;
  const tasks = await Task.findAll({ where });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const { text, category, boardId } = req.body;
  if (!text || !category || !boardId) return res.status(400).json({ error: 'Faltan datos' });
  const task = await Task.create({
    text,
    category,
    boardId,
    userId: req.user.id,
    completed: false,
  });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'No encontrada' });
  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;
  await task.save();
  res.json(task);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'No encontrada' });
  await task.destroy();
  res.status(204).end();
};

exports.clearCompleted = async (req, res) => {
  const { boardId, category } = req.body;
  const where = { userId: req.user.id, completed: true };
  if (boardId) where.boardId = boardId;
  if (category) where.category = category;
  await Task.destroy({ where });
  res.status(204).end();
};