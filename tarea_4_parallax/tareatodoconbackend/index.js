import express from "express";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

//rutas
import tareaRoutes from "./routes/tarea.routes.js";

//memoria de tareas
const tasks = [];
app.use("/", tareaRoutes(tasks));

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});