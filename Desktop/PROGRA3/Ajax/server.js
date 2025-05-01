const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, "tasks.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const readTasks = () => {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
};

const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

app.post("/api/toggle/:id", (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    writeTasks(tasks);
  }
  res.redirect("/");
});

app.post("/api/delete/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.redirect("/");
});

app.post("/api/delete-completed", (req, res) => {
  let tasks = readTasks().filter(task => !task.completed);
  writeTasks(tasks);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Servidor Express en http://localhost:${PORT}`);
});
