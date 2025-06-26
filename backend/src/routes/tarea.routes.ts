import { Router } from "express";
import { listarTareas, agregarTarea, borrarTarea, modificarTarea, completarTarea, borrarTareasCompletadas } from "../modules/tareas/tarea.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requestHandler } from "../middleware/request-handler.middleware"; // Adjust the path if needed
const router = Router();

router.get("/", requireAuth, requestHandler(listarTareas));
router.post("/", requireAuth, requestHandler(agregarTarea));
router.delete("/", requireAuth, requestHandler(borrarTareasCompletadas));
router.delete("/:id", requireAuth, requestHandler(borrarTarea));
router.patch("/:id", requireAuth, requestHandler(modificarTarea));
router.patch("/:id/completar", requireAuth, requestHandler(completarTarea));

export default router;
