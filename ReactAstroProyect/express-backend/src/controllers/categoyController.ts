// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\controllers\categoryController.ts
import { Request, Response } from "express";
import { 
  getAllCategories, 
  createCategory, 
  removeCategory, 
  checkCategoryExists, 
  getCategoriesByUserId, 
  checkCategoryPermissionService as checkCategoryPermission,
  shareCategory,
  getCategoryPermissionsList,
  changeCategoryPermission,
  removeCategoryPermissionService
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

export const checkCategoryExistsHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exists = await checkCategoryExists(id);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const shareCategoryHandler = async (req: Request, res: Response) => {
  const { categoryId, userEmail, role } = req.body;
  const user = req.user as { id: string };

  try {
    await shareCategory(categoryId, userEmail, role, user.id);
    res.status(200).json({ message: "Categoría compartida exitosamente" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

// Permisos de una cat
export const getCategoryPermissionsHandler = async (req: Request, res: Response) => {
  const { categoryId, id } = req.params;
  const user = req.user as { id: string };

  try {
    const permissions = await getCategoryPermissionsList(categoryId, user.id);
    res.json(permissions);
  } catch (error) {

    res.status(500).json({ error: (error as Error).message });
  }
};

// Cambiar permisos de un usuario
export const updateCategoryPermissionHandler = async (req: Request, res: Response) => {
  const { categoryId, targetUserId, newRole } = req.body;
  const user = req.user as { id: string };

  try {
    await changeCategoryPermission(categoryId, targetUserId, newRole, user.id);
    res.status(200).json({ message: "Permisos actualizados exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Eliminar permisos de un usuario sobre una categoría
export const removeCategoryPermissionHandler = async (req: Request, res: Response) => {
  const { categoryId, targetUserId } = req.body;
  const user = req.user as { id: string };

  try {
    await removeCategoryPermissionService(categoryId, targetUserId, user.id);
    res.status(200).json({ message: "Permisos removidos exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};