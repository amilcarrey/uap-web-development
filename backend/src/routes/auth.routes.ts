import { Router } from "express";
import { login, register, me, logout, borrarCuenta } from "../modules/auth/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requestHandler } from "../middleware/request-handler.middleware";
const router = Router();

router.post("/login", requestHandler(login));
router.post("/register", register);
router.get("/me", requireAuth, me);
router.post("/logout", logout);
router.delete("/cuenta", requireAuth, borrarCuenta);

export default router;
