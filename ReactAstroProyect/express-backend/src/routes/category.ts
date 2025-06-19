import express from "express";
import { getCategoriesHandler, addCategoryHandler, deleteCategoryHandler } from "../controllers/categoyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", authMiddleware, getCategoriesHandler);

// Agregar una nueva categoría
router.post("/",authMiddleware, addCategoryHandler);

// Eliminar una categoría
router.delete("/:id", authMiddleware, deleteCategoryHandler);

export default router;