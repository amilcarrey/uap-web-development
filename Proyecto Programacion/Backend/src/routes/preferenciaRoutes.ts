import { Router } from "express";
import { PreferenceController } from "../controllers/PreferenceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, PreferenceController.getPreferences);
router.put("/", authMiddleware, PreferenceController.updatePreferences);

export default router;