import { Router } from "express";
import { TaskController } from "../modules";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkCreateTaskPermission } from "../middleware/checkControlTarea";
import { checkTaskPermission } from "../middleware/checkTareaPermiso";

const router = Router();

router.use(authMiddleware);

// GET: Obtener todas las tareas (mejorarás luego con paginación y filtro por board_id)
router.get("/", TaskController.getAll);

// POST: Crear tarea → necesita ser editor u owner
router.post("/", checkCreateTaskPermission(["owner", "editor"]), TaskController.create);

// POST: Limpiar tareas completadas (igual que crear)
router.post("/clear-completed", checkCreateTaskPermission(["owner", "editor"]), TaskController.clearCompleted);

// POST: Actualizar tarea → necesita permisos sobre esa tarea
router.post("/:id", checkTaskPermission(["owner", "editor"]), TaskController.update);

// DELETE: Eliminar tarea → necesita permisos sobre esa tarea
router.delete("/:id", checkTaskPermission(["owner", "editor"]), TaskController.remove);

export default router;
