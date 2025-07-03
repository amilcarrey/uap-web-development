import {
  crearTareaController,
  obtenerTareasController,
  eliminarTareaController,
  toggleTareaController,
  actualizarTareaController,
} from "../controllers/tarea.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { permisoTablero } from "../middlewares/permisos.js";
import { eliminarTareasCompletadas } from "../servieces/tareaServieces.js";
import { obtenerTareasFiltradasController } from "../controllers/tarea.controller.js";

export default function tareaRoutes() {
  const router = Router();

  // Ruta para crear una nueva tarea
  router.post(
    "/tareas",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    crearTareaController
  );

  // Ruta para obtener las tareas de un tablero
  router.get(
    "/tableros/:tableroId/tareas",
    authMiddleware,
    permisoTablero(["lector", "editor", "propietario"]),
    obtenerTareasController
  );

  // Ruta para eliminar una tarea por ID
  router.delete(
    "/tareas/:id",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    eliminarTareaController
  );

  // Ruta para cambiar el estado de una tarea (completar o descompletar)
  router.patch(
    "/tareas/:id/toggle",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    toggleTareaController
  );

  // Ruta para actualizar una tarea por ID
  router.put(
    "/tareas/:id",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    actualizarTareaController
  );

  //Filtrar tareas de un tablero
  router.get(
    "/tableros/:tableroId/tareas/filtrar",
    authMiddleware,
    permisoTablero(["lector", "editor", "propietario"]),
    obtenerTareasFiltradasController
  );

  // Ruta para eliminar tareas completadas de un tablero
  router.delete(
    "/tableros/:tableroId/tareas/completadas",
    authMiddleware,
    permisoTablero(["propietario", "editor"]),
    async (req, res) => {
      await eliminarTareasCompletadas(req.params.tableroId);
      res.json({ message: "Tareas completadas eliminadas" });
    }
  );

  return router;
}
