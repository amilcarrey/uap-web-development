import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { tasks } from "./data.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, "public")));

//rutas
import tareaRoutes from "./routes/tarea.routes.js";
app.use("/api", tareaRoutes(tasks));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
