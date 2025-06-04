import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

interface Board {
  id: number;
  name: string;
}
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  boardId: number;
}

let boards: Board[] = [];
let nextBoardId = 1; // Comenzar desde 1 y solo incrementar

let tasks: Todo[] = [];
let nextId = 1; // Comenzar desde 1 y solo incrementar

// Eliminada función reassignTaskIds

// Logging para debugging
function logTasks(operation: string) {
  console.log(`[${operation}] Tasks:`, tasks);
}
// Logging para debugging
function logBoard(operation: string) {
  console.log(`[${operation}] Boards:`, boards);
}

//Añadido: Paginacion por server-side
app.get("/api/task", (req, res) => {
  const boardId = parseInt(req.query.boardId as string);
  const limit = parseInt(req.query.limit as string) || 5; // Limite por defecto
  const offset = parseInt(req.query.offset as string) || 0; // Offset por defecto
  const filter = (req.query.filter as string) || "all"; // Filtro por defecto

  let filteredTasks = tasks.filter((task) => task.boardId === boardId);

  //aplicar filtro
  if (filter === "activa") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (filter === "completada") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  const totalFilteredItems = filteredTasks.length;
  const paginatedTasks = filteredTasks.slice(offset, offset + limit);

  res.json({
    tasks: paginatedTasks,
    total: totalFilteredItems,
    limit,
    offset,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(totalFilteredItems / limit),
  });
});

app.post("/api/task", (req, res) => {
  const { text, boardId } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text es requerido" });
  }
  if (boardId === undefined || typeof boardId !== "number") {
    return res.status(400).json({ error: "BoardId es requerido" });
  }

  // Guardar la nueva tarea
  const newTask: Todo = {
    id: nextId++, // Usar e incrementar
    text,
    completed: false,
    boardId: boardId, // Asignar a un board por defecto si no se especifica
  };
  tasks.push(newTask);

  logTasks("POST");

  //Una unica respuesta
  return res.status(201).json(newTask);
});

app.put("/api/task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const task = tasks.find((task) => task.id === id);

  if (task) {
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    logTasks("UPDATE");
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/task/completed", (req, res) => {
  const completedCount = tasks.filter((task) => task.completed).length;
  // Filtrar tareas no completadas
  tasks = tasks.filter((task) => !task.completed);
  logTasks("DELETE_COMPLETED");
  // Enviar las tareas actualizadas
  return res.status(200).json({
    deletedCount: completedCount,
    remainingTasks: tasks,
  });
});

app.delete("/api/task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  logTasks("DELETE");
  res.status(204).send();
});

//BOARDS ROUTES:
app.get("/api/board", (req, res) => {
  res.json(boards);
});

app.post("/api/board", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Nombre es requerido" });
  }

  const newBoard: Board = {
    id: nextBoardId++, // Usar e incrementar
    name,
  };
  boards.push(newBoard);
  res.status(201).json(newBoard);
  logBoard("POST");
});

app.delete("/api/board/:id", (req, res) => {
  const id = parseInt(req.params.id);
  boards = boards.filter((board) => board.id !== id);
  tasks = tasks.filter((task) => task.boardId !== id); // Eliminar tareas asociadas
  res.status(204).send();
  logBoard("DELETE");
});

app.get("/", (req, res) => {
  res.send("TODO SERVER Tarea 7 - La API esta funcionando.");
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/checkStatus`);
});

// CheckStatus check endpoint
app.get("/checkStatus", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});