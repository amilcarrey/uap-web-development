import { Router } from "express";
import { renderHome } from "../controllers/renderHome.controller.js";
import { crearTarea } from "../controllers/tarea.controller.js";
import { eliminarTarea } from "../controllers/tarea.controller.js";
import { toggleTarea } from "../controllers/tarea.controller.js";
import { eliminarCompletadas } from "../controllers/tarea.controller.js";

export default function tareaRoutes(tasks) {
  const router = Router();

  router.get("/", (req, res) => renderHome(req, res, tasks));
  router.post("/add", (req, res) => crearTarea(req, res, tasks));
  router.post("/delete", (req, res) => eliminarTarea(req, res, tasks));
  router.post("/toggle", (req, res) => toggleTarea(req, res, tasks));
  router.post("/delete-completed", (req, res) =>
    eliminarCompletadas(req, res, tasks)
  );

  return router;
}
