import {
  crearTablero,
  obtenerTableroPorId,
  obtenerTableros,
  eliminarTablero,
} from "../controllers/tableros.controller.js";
import { compartirTablero } from "../controllers/tableros.controller.js";
import { obtenerTablerosCompartidos } from "../controllers/tableros.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { permisoTablero } from "../middlewares/permisos.js";
import { eliminarTareasCompletadas } from "../servieces/tareaServieces.js";

import { Router } from "express";

const tableroRoutes = () => {
  const router = Router();

  // Crear tablero - solo autenticado
  router.post("/tableros", authMiddleware, crearTablero);

  // Listar tableros - solo autenticado
  router.get("/tableros", authMiddleware, obtenerTableros);

  // Obtener uno - requiere permiso
  router.get(
    "/tableros/:id",
    authMiddleware,
    permisoTablero(["lector", "editor", "propietario"]),
    obtenerTableroPorId
  );

  // Eliminar tablero - requiere permiso
  router.delete(
    "/tableros/:id",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    eliminarTablero
  );

  // Compartir tablero
  router.post(
    "/tableros/:id/compartir",
    authMiddleware,
    permisoTablero(["editor", "propietario"]),
    compartirTablero
  );

  // Listar tableros compartidos
  router.get(
    "/tableros/compartidos",
    authMiddleware,
    obtenerTablerosCompartidos
  );

  // Eliminar tareas completadas
  router.delete(
    "/:tableroId/tareas/completadas",
    authMiddleware,
    permisoTablero(["propietario", "editor"]),
    async (req, res) => {
      await eliminarTareasCompletadas(req.params.tableroId);
      res.json({ message: "Tareas completadas eliminadas" });
    }
  );

  return router;
};
export default tableroRoutes;
