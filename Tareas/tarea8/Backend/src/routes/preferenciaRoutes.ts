import { Router } from "express";
import { PreferenceController } from "../controllers/PreferenceController";
const router = Router();

router.get("/", PreferenceController.getPreferences);
router.put("/", PreferenceController.updatePreferences);

export default router;