import express from "express";
import { getCategoriesHandler, addCategoryHandler, deleteCategoryHandler } from "../controllers/categoyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { shareCategoryHandler, getCategoryPermissionsHandler, updateCategoryPermissionHandler, removeCategoryPermissionHandler } 
from "../controllers/categoyController.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", authMiddleware, getCategoriesHandler);

// Agregar una nueva categoría
router.post("/",authMiddleware, addCategoryHandler);

// Eliminar una categoría
router.delete("/:id", authMiddleware, deleteCategoryHandler);

// Compartir una categoría con otro usuario
router.post("/:id/share", authMiddleware, shareCategoryHandler);
// Frontend: POST /api/categorias/trabajo123/share
// Body: { userEmail: "user@email.com", role: "editor" }

// Obtener permisos de una categoría  
router.get("/:id/permissions", authMiddleware, getCategoryPermissionsHandler);
// Recibimos { id: "trabajo123" } en req.params

// Actualizar permisos de un usuario en una categoría
router.put("/:id/permissions", authMiddleware, updateCategoryPermissionHandler);
// Body: { targetUserId: "user123" , newRole: "editor" }

// Eliminar  permisos de un usuario de una categoría
router.delete("/:id/permissions", authMiddleware, removeCategoryPermissionHandler);
// Body: { targetUserId: "user123" }

export default router;