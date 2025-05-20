const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // ya no necesitas body-parser

let tasks = [];
let currentId = 1;

// Crear tarea
app.post('/api/tasks', (req, res) => {
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

// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Alternar tarea completada
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  task.completed = !task.completed;
  res.json(task);
});

// Eliminar tarea por ID
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  res.status(204).end();
});

// Eliminar tareas completadas
app.delete('/api/tasks/completed', (req, res) => {
  tasks = tasks.filter((t) => !t.completed);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
