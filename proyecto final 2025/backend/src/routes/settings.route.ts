import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { SettingsController } from "../modules/settings/settings.controller";

const router = Router();

router.use(authMiddleware);

// GET: obtener configuración del usuario
router.get("/", SettingsController.getSettings);

// PUT: actualizar configuración del usuario
router.put("/", SettingsController.updateSettings);

export default router;
