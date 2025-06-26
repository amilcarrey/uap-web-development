import { Router } from "express";
import { obtenerConfig, guardarConfig } from "../modules/user_config/user_config.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requestHandler } from "../middleware/request-handler.middleware";

const router = Router();

router.get("/", requireAuth, requestHandler(obtenerConfig));
router.post("/", requireAuth, requestHandler(guardarConfig));

export default router;