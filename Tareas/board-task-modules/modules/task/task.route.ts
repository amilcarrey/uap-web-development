import express from "express";
import { TaskController } from "./task.controller";
import { authWithHeadersMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();
const controller = new TaskController();

router.get("/:boardId", authWithHeadersMiddleware, controller.getTasks);
router.post("/:boardId", authWithHeadersMiddleware, controller.createTask);
router.delete("/:id", authWithHeadersMiddleware, controller.deleteTask);
router.patch("/:id/toggle", authWithHeadersMiddleware, controller.toggleTask);

export { router as taskRoutes };
