import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { checkBoardPermission } from "../middleware/checkBoardPermission";
import { getTasks, createTask } from "../controllers/taskController";

const router = express.Router();
router.use(requireAuth);

router.get(
  "/", 
  checkBoardPermission(["owner","editor","viewer"]), 
  getTasks
);
router.post(
  "/", 
  checkBoardPermission(["owner","editor"]), 
  createTask
);

export default router;
