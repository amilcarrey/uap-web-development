// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// 1) Auth (registro / login)
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes());

// 2) Configuración de usuario
// —> Asegúrate de crear estos dos ficheros:
//    - server/routes/configuracion.routes.js
//    - server/controllers/configuracion.controller.js
import configuracionRoutes from "./routes/configuracion.routes.js";
app.use("/api/configuracion", configuracionRoutes());

// 3) Tableros y permisos
import tablerosRoutes from "./routes/tableros.routes.js";
import permisoRoutes   from "./routes/permiso.routes.js";
app.use("/api/tableros",          tablerosRoutes());
app.use("/api/tableros",          permisoRoutes());

// 4) Tareas dentro de un tablero
import tareasRoutes   from "./routes/tarea.routes.js";
app.use("/api/tableros/:tablero_id/tareas", tareasRoutes());

// 5) Usuarios (para endpoints como GET /api/usuarios/:id, etc.)
import usuariosRoutes from "./routes/usuarios.routes.js";
app.use("/api/usuarios", usuariosRoutes());

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
