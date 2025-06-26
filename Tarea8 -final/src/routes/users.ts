// routes/users.ts
import { Router } from "express";
import { getUserByUsername } from "../controllers/usersController";
const router = Router();

router.get("/by-username/:username", getUserByUsername);
export default router;
