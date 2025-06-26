import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, me);

export default router;
