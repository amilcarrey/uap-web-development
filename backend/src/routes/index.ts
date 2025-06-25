import { Router } from "express";
import tareaRoutes from "./tarea.routes";
import tableroRoutes from "./tablero.routes";
import authRoutes from "./auth.routes";
import userConfigRoutes from "./user_config.routes";
import fondosRoutes from "./fondos.routes";

const router = Router();

router.use("/tareas", tareaRoutes);
router.use("/tableros", tableroRoutes);
router.use("/auth", authRoutes);
router.use("/config", userConfigRoutes);
router.use("/fondos", fondosRoutes);

export default router;
