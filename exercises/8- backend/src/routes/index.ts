import { Router } from "express";
import userRoutes from "./user.routes";
import boardRoutes from "./board.routes";
import taskRoutes from "./task.routes";
import filterRoutes from "./filter.routes";

const router = Router();

// Mount route modules
router.use("/users", userRoutes);
router.use("/boards", boardRoutes);
router.use("/tasks", taskRoutes);
router.use("/filter", filterRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
