import { Router } from "express";
import { ReminderRepository } from "../modules/reminder/reminder.repository";
import { ReminderService } from "../modules/reminder/reminder.service";
import { ReminderController } from "../modules/reminder/reminder.controller";
import { authWithCookiesMiddleware, authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';
import { reminderValidators, handleValidationErrors } from "../validators";

const router = Router();

// Inyección de dependencias
const reminderRepository = new ReminderRepository();
const reminderService = new ReminderService(reminderRepository);
const reminderController = new ReminderController(reminderService);

// Middleware de autenticación para todas las rutas de reminders
router.use(authWithCookiesMiddleware);

// Rutas para Reminders
router.get("/:board_id", requirePermission(AccessLevel.viewer), reminderController.getAllRemindersByBoardId); // lista por board
router.get("/single/:id", 
  reminderValidators.reminderId, 
  handleValidationErrors, 
  reminderController.getReminderById
); // una específica
router.post("/", 
  reminderValidators.create, 
  handleValidationErrors, 
  requirePermission(AccessLevel.full_access), 
  reminderController.createReminder
);
router.delete("/:id", 
  reminderValidators.reminderId, 
  handleValidationErrors, 
  requirePermission(AccessLevel.full_access), 
  reminderController.deleteReminder
);
router.patch('/:id/toggle', 
  reminderValidators.reminderId, 
  handleValidationErrors, 
  requirePermission(AccessLevel.full_access), 
  reminderController.toggleReminder
);
router.delete("/completed/:board_id", requirePermission(AccessLevel.full_access), reminderController.deleteCompletedTasks);
router.put("/:id", 
  reminderValidators.update, 
  handleValidationErrors, 
  requirePermission(AccessLevel.full_access), 
  reminderController.editReminder
);

export { router as reminderRoutes };
