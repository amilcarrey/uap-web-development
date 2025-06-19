// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\services\categoryService.ts
import { 
  addCategory, 
  deleteCategory, 
  getCategories, 
  categoryExists,
  getCategoriesByUserId as getCategoriesByUserIdModel
} from "../models/categoryModel.js";

export async function getAllCategories() {
  return await getCategories(); // Llama al modelo
}

export async function createCategory(id: string, name: string) {
  if (!name) {
    throw new Error("El nombre de la categoría es requerido");
  }
  await addCategory(id, name);
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