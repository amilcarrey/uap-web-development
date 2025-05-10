import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('dist'));

app.set('view engine', 'ejs');
app.set('views', './views'); // Asegúrate de tener tus templates en un directorio 'views'

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let tasks: Todo[] = [];
let nextId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

function reassignTaskIds() {
    tasks.sort((a, b) => a.id - b.id); // Sort tasks by ID
    tasks.forEach((task, index) => {
        task.id = index + 1; // Reassign IDs sequentially
    });
    nextId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1; // Update nextId
    console.log("Tasks after reassigning IDs:", tasks);
}


app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// Ruta raíz que renderiza index.ejs
app.get('/', (req, res) => {
    let filteredTasks = [...tasks];
    const filter = req.query.filter;
    
    if (filter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter === 'complete') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    res.render('index', { tasks: filteredTasks });
});

app.post('/api/tasks/clear-completed', (req, res) => {
    tasks = tasks.filter(t => !t.completed);
    res.redirect('/');
});

app.get("/api/task", (req, res) => {
    reassignTaskIds();
    res.json(tasks);
});

app.post("/api/task", (req, res) => {
    const { text } = req.body;
    if (text) {
        const newTask: Todo = { id: nextId++, text, completed: false };
        tasks.push(newTask);
        if (req.headers['content-type'] === 'application/json') {
        res.status(201).json(newTask);
        } else {
        res.redirect('/');
        }
    } else {
        res.status(400).json({ error: "Text is required" });
    }
    reassignTaskIds();
    res.redirect('/');
});

app.put("/api/task/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { completed } = req.body;
    const task = tasks.find((task) => task.id === id);

    if (task) {
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

app.delete("/api/task/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter((task) => task.id !== id);
    res.status(204).send();
    reassignTaskIds();
});
app.post('/api/tasks/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
    }
    res.redirect('/');
});

app.post('/api/tasks/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});