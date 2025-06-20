// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\services\categoryService.ts
import { 
  addCategory, 
  deleteCategory, 
  getCategories, 
  categoryExists,
  getCategoriesByUserId as getCategoriesByUserIdModel,
  addCategoryPermission,
  checkCategoryPermission as checkCategoryPermissionModel
} from "../models/categoryModel.js";

export async function getAllCategories() {
  return await getCategories(); // Llama al modelo
}

export async function createCategory(id: string, name: string, userId: string) {
  if (!id || !name) {
    throw new Error("El ID y el nombre de la categoría son requeridos");
  }

  if (await categoryExists(id)) {
    throw new Error("La categoría ya existe");
  }

  await addCategory(id, name); // Usa el ID proporcionado por el frontend
  await addCategoryPermission(id, userId, "owner"); // El creador es el propietario
}

export async function removeCategory(id: string) {
  if (!(await categoryExists(id))) {
    throw new Error("La categoría no existe");
  }
  await deleteCategory(id);
}

export async function checkCategoryExists(id: string): Promise<boolean> {
  return await categoryExists(id);
}

export async function getCategoriesByUserId(userId: string) {
  return await getCategoriesByUserIdModel(userId);
}

export async function checkCategoryPermissionService(categoryId: string, userId: string, requiredRole: string): Promise<boolean> {
  return await checkCategoryPermissionModel(categoryId, userId, requiredRole);
} 

