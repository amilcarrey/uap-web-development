// server/routes/tarea.routes.js
import { Router } from "express";
import autenticarJWT from "../middlewares/auth.js";
import { autorizarRol } from "../middlewares/autorizarRol.js";
import {
  obtenerTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  eliminarTareasCompletas
} from "../controllers/tarea.controller.js";

const router = Router({ mergeParams: true });

// Todas las rutas de tareas requieren JWT
router.use(autenticarJWT);

// 1) Listar tareas — propietario, editor o lector
router.get(
  "/",
  autorizarRol("propietario","editor","lector"),
  obtenerTareas
);

// 2) Obtener detalle de una tarea — propietario, editor o lector
router.get(
  "/:id",
  autorizarRol("propietario","editor","lector"),
  obtenerTareaPorId
);

// 3) Crear tarea — propietario u editor
router.post(
  "/",
  autorizarRol("propietario","editor"),
  crearTarea
);

// 4) Actualizar tarea — propietario u editor
router.put(
  "/:id",
  autorizarRol("propietario","editor"),
  actualizarTarea
);

// 5) Borrar todas las completadas — propietario u editor
router.delete(
  "/completadas",
  autorizarRol("propietario","editor"),
  eliminarTareasCompletas
);

// 6) Eliminar una tarea — propietario u editor
router.delete(
  "/:id",
  autorizarRol("propietario","editor"),
  eliminarTarea
);

export default () => router;
