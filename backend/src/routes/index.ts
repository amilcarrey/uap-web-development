import { Router } from "express";
import tareaRoutes from "./tarea.routes";
import tableroRoutes from "./tablero.routes";

const router = Router();

router.use("/tareas", tareaRoutes);
router.use("/tableros", tableroRoutes);

export default router;
