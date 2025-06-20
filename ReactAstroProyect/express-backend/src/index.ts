import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// Importar rutas y modelos
import categoryRoutes from "./routes/category.js"; 
import taskRoutes from "./routes/tasks.js";
import userSettingsRoutes from "./routes/userSettings.js";
import authRoutes from "./routes/userRoutes.js"; 
import { createCategoryTable } from "./models/categoryModel.js";
import { createTaskTable } from "./models/taskModel.js";
import { createUserSettingsTable } from "./models/userSettingsModel.js"; 



dotenv.config();
const app = express();

// Middlewares
app.use(cors());


// Inicializar tablas en la base de datos
(async () => {
  await createCategoryTable();
  await createTaskTable();
  await createUserSettingsTable()
  console.log("Tablas inicializadas correctamente");
})();

// Rutas
app.use(express.json()); // Middleware para parsear JSON
app.use("/api/categorias", categoryRoutes); // Usando las rutas importadas
app.use("/api/tasks", taskRoutes); // Usando las rutas importadas
app.use("/api/auth", authRoutes); // Usando las rutas de autenticación
app.use("/api/userSettings", userSettingsRoutes); // Usando las rutas de configuración de usuario

// Iniciar servidor
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));