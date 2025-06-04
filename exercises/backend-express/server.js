// server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks → crea una nueva tarea
app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;
  const newTask = { id: nextId++, title, completed: completed || false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /tasks/:id → actualiza parcialmente (por ejemplo, completed)
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'No existe la tarea' });

  // Solo actualizamos las propiedades que vienen en body
  if (typeof req.body.title !== 'undefined') {
    task.title = req.body.title;
  }
  if (typeof req.body.completed !== 'undefined') {
    task.completed = req.body.completed;
  }
  res.json(task);
});

// DELETE /tasks/:id → borra una tarea
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

// DELETE /tasks/completed → borra todas las completadas
app.delete('/tasks/completed', (req, res) => {
  tasks = tasks.filter(t => !t.completed);
  res.status(204).end();
});

// Levantamos el servidor en el puerto 4000
const PORT = 4000;
app.listen(4000, () => {
  console.log('API escuchando en http://localhost:4000');
});
