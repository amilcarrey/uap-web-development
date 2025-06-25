import { Router } from "express";
import { listarTableros, agregarTablero, borrarTablero, compartir, listarUsuariosCompartidos, obtenerRol } from "../modules/tableros/tablero.controller";
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();

router.get("/", requireAuth, listarTableros);
router.post("/", requireAuth, agregarTablero);
router.delete("/:id", requireAuth, borrarTablero); 
router.post("/:tableroId/compartir", requireAuth, compartir);
router.get("/:tableroId/rol", requireAuth, obtenerRol);
router.get("/:tableroId/usuarios", requireAuth, listarUsuariosCompartidos);

export default router;
