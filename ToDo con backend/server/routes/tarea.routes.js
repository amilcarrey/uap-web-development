import { Router } from "express";
import { crearTarea } from "../controllers/tarea.controller.js";
import { obtenerTareas } from "../controllers/tarea.controller.js";
import { eliminarTarea } from "../controllers/tarea.controller.js";
import { toggleTarea } from "../controllers/tarea.controller.js";
import { eliminarCompletadas } from "../controllers/tarea.controller.js";

export default function tareaRoutes(tasks) {
  const router = Router();
  router.post("/tareas", crearTarea);
  router.get("/tareas", obtenerTareas);
  router.post("/tareas/:index", eliminarTarea);
  router.post("/tareas/:index/toggle", toggleTarea);
  router.delete("/tareas/completadas", eliminarCompletadas);

  return router;
}
