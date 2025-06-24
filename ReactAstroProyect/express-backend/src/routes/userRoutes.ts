import express from "express";
import { registerHandler, loginHandler, getUsersHandler, logoutHandler, getCurrentUserHandler } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Rutas publicas 
router.post("/register", registerHandler);
router.post("/login", loginHandler);

//Rutas privadas
router.get("/me", authMiddleware, getCurrentUserHandler);  
router.post("/logout", authMiddleware, logoutHandler);     
router.get("/users", authMiddleware, getUsersHandler);     

export default router;