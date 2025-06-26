import { Router } from "express";
import {
  obtenerFondos,
  agregarFondo,
  eliminarFondo,
} from "../modules/fondos/fondos.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requestHandler } from "../middleware/request-handler.middleware";

const router = Router();

router.get("/", requireAuth, requestHandler(obtenerFondos));
router.post("/", requireAuth, requestHandler(agregarFondo));
router.delete("/:id", requireAuth, requestHandler(eliminarFondo));

export default router;