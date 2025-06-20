import express from "express";
import { registerHandler, loginHandler, getUsersHandler } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/admin/users", authMiddleware, getUsersHandler); 
export default router;