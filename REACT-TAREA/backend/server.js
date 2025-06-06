// backend/server.js
import express from 'express';
import cors from 'cors';
import { state } from './state.js';

const app = express();
const PORT = 4321;


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


app.get('/api/tasks', (req, res) => {
  return res.status(200).json(state.tasks);
});


app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texto inválido' });
  }
  if (!Array.isArray(state.tasks)) state.tasks = [];

  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  state.tasks.push(newTask);
  return res.status(201).json(newTask);
});


app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed, text } = req.body;

  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  if (completed !== undefined) {
    task.completed = Boolean(completed);
  }
  if (text !== undefined && typeof text === 'string') {
    task.text = text.trim();
  }

  return res.status(200).json(task);
});


app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const beforeCount = state.tasks.length;
  state.tasks = state.tasks.filter((t) => t.id !== id);

  if (state.tasks.length === beforeCount) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  return res.status(204).send();
});

app.delete('/api/tasks', (req, res) => {
  const { completed } = req.query;
  if (completed === 'true') {
    state.tasks = state.tasks.filter((t) => !t.completed);
    return res.status(204).send();
  }
  return res.status(400).json({ error: 'Parámetros inválidos' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});
