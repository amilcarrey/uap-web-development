
const express = require('express');
const router = express.Router();


let tasks = [];
let currentId = 1;


router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'El texto de la tarea es obligatorio' });
  }

  const newTask = {
    id: currentId++,
    text,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});


router.get('/', (req, res) => {
  res.json(tasks);
});


router.patch('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  task.completed = !task.completed;
  res.json(task);
});


router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  res.status(204).end();
});


router.delete('/completed', (req, res) => {
  tasks = tasks.filter((t) => !t.completed);
  res.status(204).end();
});

module.exports = router;
