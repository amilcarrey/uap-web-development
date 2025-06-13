// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\controllers\categoryController.ts
import { Request, Response } from "express";
import { 
  getAllCategories, 
  createCategory, 
  removeCategory, 
  checkCategoryExists 
} from "../services/categoryServices.js";

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categorias = await getAllCategories();// Llama al servicio
    res.status(200).json(categorias);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const addCategoryHandler = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  try {
    await createCategory(id, name);
    res.status(201).json({ message: "Categoría agregada exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await removeCategory(id);
    res.status(200).json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};