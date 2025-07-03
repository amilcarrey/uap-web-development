import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import boardRoutes from "./routes/boardRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Rutas protegidas
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

// Start
app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});