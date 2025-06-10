// server.js (en la raíz del backend-express)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria
let boards = [
  { id: 1, name: 'General' }
];
let nextBoardId = 2;

let tasks = [
  // Ejemplo inicial:
  { id: 1, title: 'Tarea ejemplo', completed: false, boardId: 1 }
];
let nextTaskId = 2;

// ---------------------------
// Endpoints de Tableros
// ---------------------------

// GET /boards → lista todos los tableros
app.get('/boards', (req, res) => {
  res.json(boards);
});

// POST /boards → crea un nuevo tablero
app.post('/boards', (req, res) => {
  const { name } = req.body;
  const newBoard = { id: nextBoardId++, name };
  boards.push(newBoard);
  res.status(201).json(newBoard);
});

// DELETE /boards/:id → elimina un tablero y sus tareas
app.delete('/boards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  boards = boards.filter(b => b.id !== id);
  tasks = tasks.filter(t => t.boardId !== id);
  res.status(204).end();
});

// ---------------------------
// Endpoints de Tareas con Paginación
// ---------------------------

// GET /boards/:boardId/tasks?page=&limit= → tareas de un tablero
app.get('/boards/:boardId/tasks', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const boardTasks = tasks.filter(t => t.boardId === boardId);

  const start = (page - 1) * limit;
  const paginated = boardTasks.slice(start, start + limit);
  const totalPages = Math.ceil(boardTasks.length / limit);

  res.json({
    data: paginated,
    page,
    totalPages,
    totalItems: boardTasks.length
  });
});

// POST /boards/:boardId/tasks → crea una tarea en un tablero
app.post('/boards/:boardId/tasks', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const { title, completed } = req.body;
  const newTask = {
    id: nextTaskId++,
    title,
    completed: completed || false,
    boardId
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /boards/:boardId/tasks/:id → actualizar tarea
app.patch('/boards/:boardId/tasks/:id', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id && t.boardId === boardId);
  if (!task) return res.status(404).json({ error: 'No existe la tarea' });

  const { title, completed } = req.body;
  if (typeof title !== 'undefined') task.title = title;
  if (typeof completed !== 'undefined') task.completed = completed;

  res.json(task);
});

// DELETE /boards/:boardId/tasks/:id → elimina tarea
app.delete('/boards/:boardId/tasks/:id', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => !(t.id === id && t.boardId === boardId));
  res.status(204).end();
});

// DELETE /boards/:boardId/tasks/completed → elimina todas las completadas
app.delete('/boards/:boardId/tasks/completed', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  tasks = tasks.filter(t => !(t.boardId === boardId && t.completed));
  res.status(204).end();
});

// ---------------------------
// Levantar servidor
// ---------------------------

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
