// /src/routes/authRoutes.ts
import { Router } from "express";
import { login, logout, register, me } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/me", requireAuth, me);

export default router;
