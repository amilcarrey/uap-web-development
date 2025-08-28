import { Router } from "express";
import { SettingsRepository } from "../modules/settings/settings.repository";
import { SettingsService } from "../modules/settings/settings.service";
import { SettingsController } from "../modules/settings/settings.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";

const router = Router();

const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

router.use(authWithCookiesMiddleware);

router.get("/", settingsController.getSettings);
router.post("/", settingsController.saveSettings);

export { router as settingsRoutes };
