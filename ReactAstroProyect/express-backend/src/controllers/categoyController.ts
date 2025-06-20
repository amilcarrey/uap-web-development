// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\controllers\categoryController.ts
import { Request, Response } from "express";
import { 
  getAllCategories, 
  createCategory, 
  removeCategory, 
  checkCategoryExists, 
  getCategoriesByUserId, 
  checkCategoryPermissionService as checkCategoryPermission
} from "../services/categoryServices.js";



export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    // req.user viene del authMiddleware, con el payload del JWT
    const user = req.user as { id: string; role: string };

    let categories;

    if (user.role === "admin") {
      // Si es admin, trae todas
      categories = await getAllCategories();
    } else {
      // Si es usuario normal, trae solo las que pertenecen a su id
      categories = await getCategoriesByUserId(user.id);
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addCategoryHandler = async (req: Request, res: Response) => {
  const { id, name } = req.body; // Recibe el ID y el nombre desde el frontend
  const user = req.user as { id: string };

  try {
    await createCategory(id, name, user.id); // Usa el ID del  el frontend
    res.status(201).json({ message: "Categoría agregada exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as { id: string };

  try {
    const isOwner = await checkCategoryPermission(id, user.id, "owner");
    if (!isOwner) {
       res.status(403).json({ error: "Solo el propietario puede eliminar esta categoría." });
       return;
    }

    await removeCategory(id);
    res.status(200).json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};