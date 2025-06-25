import express from "express";
import taskRoute from "./routes/task.route";
import cors from "cors";
import boardRoutes from "./routes/board.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.route";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "cookie-secret"));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(requestLoggerMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoute); 
app.use("/api/boards", boardRoutes);

app.use(errorMiddleware);

app.listen(4321, () => {
  console.log("Servidor corriendo en http://localhost:4321");
});