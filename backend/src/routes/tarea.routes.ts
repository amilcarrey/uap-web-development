import { Router } from "express";
import { listarTareas, agregarTarea } from "../modules/tareas/tarea.controller";

const router = Router();

router.get("/", listarTareas);
router.post("/", agregarTarea);

export default router;
