// filepath: c:\Progra3\uap-web-development\ReactAstroProyect\express-backend\src\services\categoryService.ts
import { 
  addCategory, 
  deleteCategory, 
  getCategories, 
  categoryExists,
  getCategoriesByUserId as getCategoriesByUserIdModel,
  addCategoryPermission,
  checkCategoryPermission as checkCategoryPermissionModel,
  getCategoryPermissions,
  updateCategoryPermission,
  removeCategoryPermission,
  getUserByEmail,
  getCategoriesWithUserInfo
} from "../models/categoryModel.js";

// tipo para categoría
type CategoryWithUserId = {
  id: string;
  name: string;
  userId: string;
};

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

// Compartir una categoría con otro usuario
export async function shareCategory(categoryId: string, userEmail: string, role: string, ownerId: string) {
  // Verificar que el usuario que comparte sea el propietario
  const isOwner = await checkCategoryPermissionService(categoryId, ownerId, "owner");
  if (!isOwner) {
    throw new Error("Solo el propietario puede compartir la categoría.");
  }

  // Buscar el usuario por email
  const targetUser = await getUserByEmail(userEmail) as { id: string };
  if (!targetUser) {
    throw new Error("Usuario no encontrado con ese email.");
  }

  // Verificar que no sea el mismo propietario
  if (targetUser.id === ownerId) {
    throw new Error("No puedes compartir contigo mismo.");
  }

  // Verificar que el usuario no tenga ya permisos
  const existingPermission = await checkCategoryPermissionService(categoryId, targetUser.id, role);
  if (existingPermission) {
    throw new Error("El usuario ya tiene permisos en esta categoría.");
  }

  await addCategoryPermission(categoryId, targetUser.id, role);
}

// Obtener permisos de una categoría (solo si el usuario tiene al menos rol "viewer")
// Devuelve una lista de usuarios con sus roles
export async function getCategoryPermissionsList(categoryId: string, userId: string) {
  // Verificar que el usuario tenga permisos (al menos viewer)
  const hasPermission = await checkCategoryPermissionService(categoryId, userId, "viewer");
  if (!hasPermission) {
    throw new Error("No tienes permisos para ver los permisos de esta categoría.");
  }

  return await getCategoryPermissions(categoryId);
}

// Cambiar permisos de un usuario (solo propietario)
export async function changeCategoryPermission(categoryId: string, targetUserId: string, newRole: string, ownerId: string) {
  const isOwner = await checkCategoryPermissionService(categoryId, ownerId, "owner");
  if (!isOwner) {
    throw new Error("Solo el propietario puede cambiar permisos.");
  }

  await updateCategoryPermission(categoryId, targetUserId, newRole);
}

// Remover permisos de un usuario (solo propietario)
export async function removeCategoryPermissionService(categoryId: string, targetUserId: string, ownerId: string) {
  const isOwner = await checkCategoryPermissionService(categoryId, ownerId, "owner");
  if (!isOwner) {
    throw new Error("Solo el propietario puede remover permisos.");
  }

  await removeCategoryPermission(categoryId, targetUserId);
}

// funcion para traer todas las categorías de un usuario donde tiene permisos

export async function getCategoriesWithPermissions(userId: string) {
  const categories = await getCategoriesWithUserInfo(userId); 
  
   return categories.map((category: any) => ({
    id: category.id,
    name: category.name,
    userId: category.userId, 
    userRole: category.userRole, // Viene del modelo ('owner', 'editor', 'viewer')
    isShared: category.userRole !== 'owner' // owner = categoría propia, resto = compartida
  }));
}
// Nueva función para obtener permisos específicos
async function getUserPermissionInCategory(categoryId: string, userId: string) {
  // Verificar roles en orden de permisos (mayor a menor)
  if (await checkCategoryPermissionService(categoryId, userId, "owner")) {
    return { role: "owner" };
  }
  if (await checkCategoryPermissionService(categoryId, userId, "editor")) {
    return { role: "editor" };
  }
  if (await checkCategoryPermissionService(categoryId, userId, "viewer")) {
    return { role: "viewer" };
  }
  
  return null; // Sin permisos
}

