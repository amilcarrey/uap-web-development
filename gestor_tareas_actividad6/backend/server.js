const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let tasks = [
  { id: 1, text: 'Aprender React', completed: false },
  { id: 2, text: 'Crear gestor de tareas', completed: true }
];

// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Crear nueva tarea
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: req.body.completed || false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Actualizar tarea
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json(tasks[taskIndex]);
});

// Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  res.status(204).end();
});

// Eliminar tareas completadas
app.delete('/api/tasks/completed', (req, res) => {
  tasks = tasks.filter(t => !t.completed);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});