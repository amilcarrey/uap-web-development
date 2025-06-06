import { Router } from "express";
import { crearTarea } from "../controllers/tarea.controller.js";
import { obtenerTareas } from "../controllers/tarea.controller.js";
import { toggleTarea } from "../controllers/tarea.controller.js";
import { actualizarTarea } from "../controllers/tarea.controller.js";

export default function tareaRoutes() {
  const router = Router();
  router.post("/tareas", crearTarea);
  router.get("/tareas", obtenerTareas);
  router.put("/tareas/:index", actualizarTarea);
  router.esxko("/tareas/:index", eliminarTarea);
  router.patch("/tareas/:index/toggle", toggleTarea);

  return router;
}
