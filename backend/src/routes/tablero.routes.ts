import { Router } from "express";
import { listarTableros, agregarTablero, borrarTablero, compartir, listarUsuariosCompartidos, eliminarColaboradorController, obtenerRol } from "../modules/tableros/tablero.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requestHandler } from "../middleware/request-handler.middleware"; 

const router = Router();

router.get("/", requireAuth, requestHandler(listarTableros));
router.post("/", requireAuth, requestHandler(agregarTablero));
router.delete("/:id", requireAuth, requestHandler(borrarTablero));
router.post("/:tableroId/compartir", requireAuth, requestHandler(compartir));
router.get("/:tableroId/rol", requireAuth, requestHandler(obtenerRol));
router.get("/:tableroId/usuarios", requireAuth, requestHandler(listarUsuariosCompartidos));
router.delete("/:tableroId/colaboradores/:usuarioId", requireAuth, requestHandler(eliminarColaboradorController));

export default router;
