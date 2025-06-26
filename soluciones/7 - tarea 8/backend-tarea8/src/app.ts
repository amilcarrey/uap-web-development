import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import boardsRoutes from "./routes/boards.routes";
import tasksRoutes from "./routes/tasks.routes";
import usersRoutes from "./routes/users.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: true, // acepta solicitudes desde cualquier origen (ideal para desarrollo)
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", usersRoutes);

// Middleware para manejar errores
app.use(errorMiddleware);

// Conectar DB y levantar servidor
AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((error) => console.error("DB connection error:", error));
