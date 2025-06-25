const Task = require('../models/Task');

exports.getAll = async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.user.id } });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const { text, category, boardId } = req.body;
  const task = await Task.create({
    text,
    category,
    boardId,
    completed: false,
    userId: req.user.id,
  });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Not found' });
  await task.update(req.body);
  res.json(task);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Not found' });
  await task.destroy();
  res.status(204).end();
};