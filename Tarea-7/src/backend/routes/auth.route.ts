import { Router } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();


const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);


const wrapAsync = (fn: any) => (req: any, res: any, next: any) =>
  fn(req, res).catch(next);


router.get("/me", authenticate, wrapAsync(authController.getCurrentUser));


router.post("/signup", wrapAsync(authController.register));
router.post("/login", wrapAsync(authController.login));
router.post("/logout", wrapAsync(authController.logout));

export { router as authRoutes };
