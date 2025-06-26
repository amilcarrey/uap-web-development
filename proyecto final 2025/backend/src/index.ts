import express from "express";
import cors from "cors"; 
import boardRoutes from "./routes/board.route";
import taskRoutes from "./routes/task.route";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import settingsRoutes from "./routes/settings.route";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "http://localhost:5173", // 👈 el frontend
  credentials: true,              // 👈 permite cookies
}));

app.use(express.json());
app.use(cookieParser("secret"));
app.use(requestLogger); // Middleware para registrar peticiones
// req.signedCookies["token"]

// Rutas
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);


app.use(errorHandler); // Middleware para manejar errores

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 
