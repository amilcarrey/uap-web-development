import { Router } from "express";
import { PermissionsController } from "../modules/permissions/permissions.controller";
import { PermissionsService } from "../modules/permissions/permissions.service";
import { PermissionsRepository } from "../modules/permissions/permissions.repository";

const router = Router();

const permissionsRepository = new PermissionsRepository();
const permissionsService = new PermissionsService(permissionsRepository);
const permissionsController = new PermissionsController(permissionsService);


router.post("/assign", permissionsController.assignPermission);


router.get("/user/:usuarioId/tablero/:tableroId", permissionsController.getUserPermission);


router.delete("/remove", permissionsController.removePermission);

export { router as permissionsRoutes };
