import { Router } from "express";
import { UserSettingsController } from "../modules/userSettings/userSettings.controller";
import { UserSettingsService } from "../modules/userSettings/userSettings.service";
import { UserSettingsRepository } from "../modules/userSettings/userSettings.repository";
import { authWithCookiesMiddleware, authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';



const router = Router();
const userSettingsRepository = new UserSettingsRepository();
const userSettingsService = new UserSettingsService(userSettingsRepository);
const userSettingsController = new UserSettingsController(userSettingsService);

// Middleware de autenticación para todas las rutas de configuraciones de usuario
// Cambiamos a authWithHeadersMiddleware para que funcione con tokens Bearer
router.use(authWithCookiesMiddleware);

router.get("/", userSettingsController.getUserSettingsById);
router.post("/", userSettingsController.createUserSettings);
router.put("/",userSettingsController.updateUserSettings);

//export const userSettingsRoutes = router;
export { router as userSettingsRoutes };