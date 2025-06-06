import express from "express";
import cors from "cors";
import { tasks } from "./data.js";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


import tareaRoutes from "./routes/tarea.routes.js";
import tableroRoutes from "./routes/tableros.routes.js";
app.use("/api", tareaRoutes(tasks));
app.use("/api", tableroRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
