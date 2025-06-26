import { Router } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";
import { validateAuth } from "../validators/authValidatorXd";

// Solo usuarios autenticados pueden ver todos los usuarios
//router.get("/", authWithHeadersMiddleware, authController.getAllUsers);


const router = Router();
const authRepository = new AuthRepository();
// import { UserSettingsService } from "../modules/auth/user-settings.service";
// const userSettingsService = new UserSettingsService();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.get("/",authWithCookiesMiddleware, authController.getAllUsers);
router.post("/", validateAuth, authController.createUser);
router.post("/login", validateAuth, authController.login);
router.post("/logout",authWithCookiesMiddleware, authController.logout);
// Ruta para validar cookies - verifica si el usuario está autenticado
router.get('/validate', authWithCookiesMiddleware, (req, res) => {
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
