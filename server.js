const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, "tasks.json");


app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());


const readTasks = () => {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
};


const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};


app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});


app.post("/api/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    name: req.body.name,
    completed: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});


app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = req.params.id;
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });

  tasks[index] = { ...tasks[index], ...req.body };
  writeTasks(tasks);
  res.json(tasks[index]);
});


app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = req.params.id;
  const updated = tasks.filter(t => t.id !== id);
  writeTasks(updated);
  res.status(204).send();
});


app.delete("/api/tasks", (req, res) => {
  const tasks = readTasks().filter(t => !t.completed);
  writeTasks(tasks);
  res.status(204).send();
});

// Servir index.html para cualquier otra ruta 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor integrado corriendo en http://localhost:${PORT}`);
});
