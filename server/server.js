import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

const DATA_FILE = resolve(__dirname, "../../tareas.json");

app.use(cors());
app.use(express.json());

const loadTasks = () => {
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, "utf8"));
};

const saveTasks = (tasks) => {
  writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  const updated = [...tasks, newTask];
  saveTasks(updated);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks(tasks);
  res.json(tasks);
});

app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  res.json(tasks);
});

app.delete("/tasks", (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => !t.completed);
  saveTasks(tasks);
  res.json(tasks);
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
