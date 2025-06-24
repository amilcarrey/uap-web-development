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
router.post("/:categoryId/share", authMiddleware, shareCategoryHandler);
// recibimos { userEmail: "user@email.com", role: "editor" }

// Obtener permisos de una categoría  
router.get("/:categoryId/permissions", authMiddleware, getCategoryPermissionsHandler);
// Recibimos { categoryId: "123", id: "456" } id es el usuario que hace el request

// Actualizar permisos de un usuario en una categoría
router.put("/:categoryId/permissions", authMiddleware, updateCategoryPermissionHandler);

// Eliminar  permisos de un usuario de una categoría
router.delete("/:categoryId/permissions", authMiddleware, removeCategoryPermissionHandler);

export default router;