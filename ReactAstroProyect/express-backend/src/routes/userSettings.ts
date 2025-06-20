import express from "express";
import { 
  getUserSettingsHandler, 
  addUserSettingHandler, 
  updateUserSettingHandler,
  deleteUserSettingHandler,
  getUserSettingHandler
} from "../controllers/userSettingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener todas las configuraciones del usuario
router.get("/", authMiddleware, getUserSettingsHandler);

// Obtener una configuración específica
router.get("/:settingKey", authMiddleware, getUserSettingHandler);

// Agregar una nueva configuración
router.post("/", authMiddleware, addUserSettingHandler);

// Actualizar una configuración
router.put("/", authMiddleware, updateUserSettingHandler);

// Eliminar una configuración
router.delete("/:settingKey", authMiddleware, deleteUserSettingHandler);

export default router;