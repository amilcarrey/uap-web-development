import { Router } from "express";
import { ReminderRepository } from "../modules/reminder/reminder.repository";
import { ReminderService } from "../modules/reminder/reminder.service";
import { ReminderController } from "../modules/reminder/reminder.controller";
import { authWithCookiesMiddleware, authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';

const router = Router();

// Inyección de dependencias
const reminderRepository = new ReminderRepository();
const reminderService = new ReminderService(reminderRepository);
const reminderController = new ReminderController(reminderService);

// Middleware de autenticación para todas las rutas de reminders
router.use(authWithCookiesMiddleware);

// Rutas para Reminders
router.get("/:board_id", requirePermission(AccessLevel.viewer), reminderController.getAllRemindersByBoardId); // lista por board
router.get("/single/:id", reminderController.getReminderById); // una específica
router.post("/",requirePermission(AccessLevel.full_access), reminderController.createReminder);
router.delete("/:id",requirePermission(AccessLevel.full_access), reminderController.deleteReminder);
router.patch('/:id/toggle',requirePermission(AccessLevel.full_access), reminderController.toggleReminder);
router.delete("/completed/:board_id", requirePermission(AccessLevel.full_access), reminderController.deleteCompletedTasks);
router.put("/:id", requirePermission(AccessLevel.full_access), reminderController.editReminder);

//TENGO QUE AGREGAR UNO PARA HACER LOS FILTROS Y BUSQUEDAAAAAA?? ES ACA O EN EL BOARD???
//ELIMINAR TODAS LAS COMPLETADAS?? PTRA RUTA?? MARCAR COMO COMPLETADA?? PTRA RUTA??
export { router as reminderRoutes };
