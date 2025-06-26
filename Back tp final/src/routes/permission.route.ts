import { Router } from "express";
import { PermissionRepository } from "../modules/permission/permission.repository";
import { PermissionService } from "../modules/permission/permission.service";   
import { PermissionController } from "../modules/permission/permission.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';
import { permissionValidators, handleValidationErrors } from "../validators";

const router = Router();
const permissionRepository = new PermissionRepository();
const permissionService = new PermissionService(permissionRepository);
const permissionController = new PermissionController(permissionService);


// Middleware de autenticación para todas las rutas de permissions
router.use(authWithCookiesMiddleware);

//router.get("/", authWithHeadersMiddleware, permissionController.getAllPermissions);//transfromarlo para que me traiga los permisos por user_id
router.get("/user/:user_id", permissionController.getPermissionsByUserId);
router.get("/:id", permissionController.getPermissionById);
router.post("/", requirePermission(AccessLevel.owner), permissionController.createPermission);
router.delete("/:id", requirePermission(AccessLevel.owner), permissionController.removePermission);
router.put("/:id", requirePermission(AccessLevel.owner),permissionController.changeAccessLevel); //en el endpoint mandar un json el nuevo cambio de access_level

export { router as permissionRoutes };