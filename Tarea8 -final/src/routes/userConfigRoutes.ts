import { Router } from "express";
import { getUserConfig, updateUserConfig } from "../controllers/userConfigController";

const router = Router();
router.get("/", getUserConfig);
router.put("/", updateUserConfig);

export default router;
