import express from "express";
import { getCategoriesHandler, addCategoryHandler, deleteCategoryHandler } from "../controllers/categoyController.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", getCategoriesHandler);

// Agregar una nueva categoría
router.post("/", addCategoryHandler);

// Eliminar una categoría
router.delete("/:id", deleteCategoryHandler);

export default router;