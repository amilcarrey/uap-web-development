import { Router } from "express";
import { login, register, me, logout } from "../modules/auth/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;
