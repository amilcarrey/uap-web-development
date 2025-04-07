const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, "tasks.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));//css

const readTasks = () => {
    if (!fs.existsSync(TASKS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
};

const writeTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

app.get("/", (req, res) => {
    const tasks = readTasks();
    const filter = req.query.filter || "all";

    const filteredTasks = tasks.filter(task =>
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "pending" && !task.completed)
    );

    const taskItems = filteredTasks.map((task, index) => `
        <li class="task-item">
            <form method="POST" action="/toggle/${index}">
                <input type="checkbox" onchange="this.form.submit()" ${task.completed ? "checked" : ""}>
            </form>
            <span class="${task.completed ? "completed" : ""}">${task.name}</span>
            <form method="POST" action="/delete/${index}">
                <button>🗑</button>
            </form>
        </li>
    `).join("");

    let html = fs.readFileSync(path.join(__dirname, "views", "index.html"), "utf8");
    html = html
        .replace("{{TASK_ITEMS}}", taskItems)
        .replace("{{ALL_SELECTED}}", filter === "all" ? "selected" : "")
        .replace("{{PENDING_SELECTED}}", filter === "pending" ? "selected" : "")
        .replace("{{COMPLETED_SELECTED}}", filter === "completed" ? "selected" : "");

    res.send(html);
});

app.post("/add", (req, res) => {
    const tasks = readTasks();
    tasks.push({ name: req.body.task, completed: false });
    writeTasks(tasks);
    res.redirect("/");
});

app.post("/toggle/:id", (req, res) => {
    const tasks = readTasks();
    const id = parseInt(req.params.id);
    if (tasks[id]) {
        tasks[id].completed = !tasks[id].completed;
        writeTasks(tasks);
    }
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const tasks = readTasks();
    const id = parseInt(req.params.id);
    tasks.splice(id, 1);
    writeTasks(tasks);
    res.redirect("/");
});

app.post("/delete-completed", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => !task.completed);
    writeTasks(tasks);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});