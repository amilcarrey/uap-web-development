import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// Importar rutas y modelos
import categoryRoutes from "./routes/category.js"; 
import taskRoutes from "./routes/tasks.js";
import userSettingsRoutes from "./routes/userSettings.js";
import authRoutes from "./routes/userRoutes.js"; 
import { createCategoryTable, createCategoryPermissionsTable } from "./models/categoryModel.js";
import { createTaskTable } from "./models/taskModel.js";
import { createUserSettingsTable } from "./models/userSettingsModel.js"; 
import { createUserTableIfNotExists } from "./models/userModel.js";



dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true //  enviar cookies
}));
app.use(express.json()); // 
app.use(cookieParser()); // 


// Inicializar tablas en la base de datos
(async () => {
  await createCategoryTable();
  await createCategoryPermissionsTable(); 
  await createTaskTable();
  await createUserSettingsTable();
  await createUserTableIfNotExists();
  console.log("Tablas inicializadas correctamente");
})();

// Rutas importadas
app.use("/api/categorias", categoryRoutes); 
app.use("/api/tasks", taskRoutes); 
app.use("/api/auth", authRoutes); 
app.use("/api/userSettings", userSettingsRoutes); 
// Iniciar servidor
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));