import express, { Request, Response } from "express";
import cors from "cors";
import { boardRoutes } from "./routes/board.route";
import { requestLogger } from "./middleware/request-logger.middleware";
import { taskRoutes } from "./routes/task.route";
import { authRoutes } from "./routes/auth.route";
import cookieParser from "cookie-parser";
import { filterRoutes } from "./routes/filter.route";
import { settingsRoutes } from "./routes/settings.route";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cookieParser("secret"));

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/settings", settingsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;