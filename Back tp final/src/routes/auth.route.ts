import { Router, Request, Response } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";
import { authValidators, handleValidationErrors } from "../validators";

// Solo usuarios autenticados pueden ver todos los usuarios
//router.get("/", authWithHeadersMiddleware, authController.getAllUsers);

const router = Router();
const authRepository = new AuthRepository();
// import { UserSettingsService } from "../modules/auth/user-settings.service";
// const userSettingsService = new UserSettingsService();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.get("/", authWithCookiesMiddleware, authController.getAllUsers);
router.post("/", authValidators.credentials, handleValidationErrors, authController.createUser);
router.post("/login", authValidators.login, handleValidationErrors, authController.login);
router.post("/logout", authWithCookiesMiddleware, authController.logout);

// Ruta para validar cookies - verifica si el usuario está autenticado
router.get('/validate', authWithCookiesMiddleware, (req: Request, res: Response) => {
  // Si llegamos aquí, significa que el middleware de cookies validó exitosamente
  // y req.user contiene la información del usuario
  res.json({ 
    authenticated: true, 
    user: { 
      id: req.user.id, 
      name: req.user.name 
    } 
  });
});

export { router as authRoutes };
