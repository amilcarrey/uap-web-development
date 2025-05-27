import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let tasks: Todo[] = [];
let nextId = 1;  // Comenzar desde 1 y solo incrementar

// Eliminada función reassignTaskIds

// Logging para debugging
function logTasks(operation: string) {
    console.log(`[${operation}] Tasks:`, tasks);
}

app.get("/api/task", (req, res) => {
    res.json(tasks);
});

app.post("/api/task", (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text es requerido" });
    }

    // Guardar la nueva tarea
    const newTask: Todo = {
        id: nextId++,  // Usar e incrementar
        text,
        completed: false,
    };
    tasks.push(newTask);

    logTasks("POST");

    //Una unica respuesta
    return res.status(201).json(newTask);
});

app.put("/api/task/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { completed } = req.body;
    const task = tasks.find((task) => task.id === id);

    if (task) {
        task.completed = completed;
        logTasks("UPDATE");
        res.json(task);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

app.delete("/api/task/completed", (req, res) => {
    const completedCount = tasks.filter(task => task.completed).length;
    // Filtrar tareas no completadas
    tasks = tasks.filter(task => !task.completed);
    logTasks("DELETE_COMPLETED");
    // Enviar las tareas actualizadas
    return res.status(200).json({ 
        deletedCount: completedCount,
        remainingTasks: tasks 
    });
});

app.delete("/api/task/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter((task) => task.id !== id);
    logTasks("DELETE");
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});