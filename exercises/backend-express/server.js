// server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria
let boards = [];
let nextBoardId = 1;

// Cada board tiene su array de tareas
// Estructura: { id: number, name: string, tasks: Array }
function createBoard(name) {
  return { id: nextBoardId++, name, tasks: [], nextTaskId: 1 };
}

// 1. Endpoints para boards
app.get('/boards', (req, res) => {
  // devolver sólo id y name de cada board
  res.json(boards.map(({ id, name }) => ({ id, name })));
});

app.post('/boards', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const board = createBoard(name);
  boards.push(board);
  res.status(201).json({ id: board.id, name: board.name });
});

app.delete('/boards/:boardId', (req, res) => {
  const boardId = parseInt(req.params.boardId);
  boards = boards.filter((b) => b.id !== boardId);
  res.status(204).end();
});

// Middleware para validar que el board exista
function findBoard(req, res, next) {
  const boardId = parseInt(req.params.boardId);
  const board = boards.find((b) => b.id === boardId);
  if (!board) return res.status(404).json({ error: 'Board no encontrado' });
  req.board = board;
  next();
}

// 2. Endpoints para tareas por board
app.get('/boards/:boardId/tasks', findBoard, (req, res) => {
  const board = req.board;
  // Paginación: ?page=X&limit=Y
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const totalTasks = board.tasks.length;
  const totalPages = Math.ceil(totalTasks / limit) || 1;
  const tasksPage = board.tasks.slice(start, end);
  res.json({ tasks: tasksPage, totalPages });
});

app.post('/boards/:boardId/tasks', findBoard, (req, res) => {
  const board = req.board;
  const { title, completed } = req.body;
  const id = board.nextTaskId++;
  const newTask = { id, title, completed: completed || false };
  board.tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/boards/:boardId/tasks/:taskId', findBoard, (req, res) => {
  const board = req.board;
  const taskId = parseInt(req.params.taskId);
  const task = board.tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  if (typeof req.body.title !== 'undefined') task.title = req.body.title;
  if (typeof req.body.completed !== 'undefined') task.completed = req.body.completed;
  res.json(task);
});

app.delete('/boards/:boardId/tasks/:taskId', findBoard, (req, res) => {
  const board = req.board;
  const taskId = parseInt(req.params.taskId);
  board.tasks = board.tasks.filter((t) => t.id !== taskId);
  res.status(204).end();
});

app.delete('/boards/:boardId/tasks/completed', findBoard, (req, res) => {
  const board = req.board;
  board.tasks = board.tasks.filter((t) => !t.completed);
  res.status(204).end();
});

// Levantar el servidor en el puerto 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log('API escuchando en http://localhost:4000');
});
