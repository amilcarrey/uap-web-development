import { Router } from "express";
import { registrarse, logearse } from "../controllers/auth.controller.js";

const router = Router();

router.post("/registrarse", registrarse);   // POST /api/auth/registrarse
router.post("/logearse", logearse);         // POST /api/auth/logearse

export default () => router;
