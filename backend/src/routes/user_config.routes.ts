import { Router } from "express";
import { obtenerConfig, guardarConfig } from "../modules/user_config/user_config.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, obtenerConfig);
router.post("/", requireAuth, guardarConfig);

export default router;