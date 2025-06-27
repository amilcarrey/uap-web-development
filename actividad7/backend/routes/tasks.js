// routes/tasks.js
const { Router } = require('express');
const { NotFoundError } = require('../errors');

const router = Router();

router.get('/:id', (req, res, next) => {
  try {
    const task = req.db.get('tasks').find({ id: req.params.id }).value();
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;