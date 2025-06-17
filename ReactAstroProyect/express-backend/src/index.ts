import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import categoryRoutes from "./routes/category.js"; // Cambiado a import
import taskRoutes from "./routes/tasks.js"; // Cambiado a import
import { createCategoryTable } from "./models/categoryModel.js";
import { createTaskTable } from "./models/taskModel.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());


// Inicializar tablas en la base de datos
(async () => {
  await createCategoryTable();
  await createTaskTable();
  console.log("Tablas inicializadas correctamente");
})();

// Rutas
app.use(express.json()); // Middleware para parsear JSON
app.use("/api/categorias", categoryRoutes); // Usando las rutas importadas
app.use("/api/tasks", taskRoutes); // Usando las rutas importadas

// Iniciar servidor
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));