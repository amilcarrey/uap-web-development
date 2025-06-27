// routes/boards.js
router.delete('/:id', (req, res) => {
  const boardId = req.params.id;

  // Borra el tablero
  const board = req.db.get('boards').find({ id: boardId }).value();
  if (!board) return res.status(404).json({ error: 'Board not found' });

  req.db.get('boards').remove({ id: boardId }).write();

  // borra las tareas relacionadas
  req.db.get('tasks').remove({ boardId }).write();

  res.status(200).json({ message: 'Board and tasks deleted' });
});
