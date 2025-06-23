import { Router } from "express";
import { PreferenceController } from "../controllers/PreferenceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", PreferenceController.getPreferences);
router.put("/", PreferenceController.updatePreferences);

export default router;