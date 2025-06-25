import { Router } from "express";
import { obtenerFondos, agregarFondo } from "../modules/fondos/fondos.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, obtenerFondos);
router.post("/", requireAuth, agregarFondo);

export default router;