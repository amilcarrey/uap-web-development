import { Router } from "express";
import { listarTareas, agregarTarea, borrarTarea, modificarTarea, completarTarea, borrarTareasCompletadas } from "../modules/tareas/tarea.controller";
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();

router.get("/", requireAuth, listarTareas);
router.post("/", requireAuth, agregarTarea);
router.delete("/", requireAuth, borrarTareasCompletadas);
router.delete("/:id", requireAuth, borrarTarea);
router.patch("/:id", requireAuth, modificarTarea);
router.patch("/:id/completar", requireAuth, completarTarea);

export default router;
