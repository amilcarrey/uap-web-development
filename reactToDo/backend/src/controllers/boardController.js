const Board = require('../models/Board');

exports.getAll = async (req, res) => {
  const boards = await Board.findAll({ where: { userId: req.user.id } });
  res.json(boards);
};

exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const board = await Board.create({ name, userId: req.user.id });
  res.status(201).json(board);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findOne({ where: { id, userId: req.user.id } });
  if (!board) return res.status(404).json({ error: 'Not found' });
  await board.destroy();
  res.status(204).end();
};