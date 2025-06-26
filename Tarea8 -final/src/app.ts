import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import tareasRoutes from "./routes/tareasRoutes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import { requireAuth } from "./middlewares/authMiddleware";
import boardsRoutes from "./routes/boardsRoutes";
import userConfigRoutes from "./routes/userConfigRoutes";
import usersRouter from "./routes/users";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // <---- la URL de tu frontend (Vite por defecto usa este puerto)
  credentials: true,               // <---- permite enviar cookies y encabezados de sesión
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/tareas",requireAuth ,tareasRoutes);
app.use("/api/boards", requireAuth, boardsRoutes);

app.use("/api/tareas", requireAuth, tareasRoutes);

app.use("/api/user/config", requireAuth, userConfigRoutes);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}/api/tareas`);
});

