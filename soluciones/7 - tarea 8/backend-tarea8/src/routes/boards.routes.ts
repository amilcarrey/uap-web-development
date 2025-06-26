import { Router } from "express";
import { authenticateJWT, authorizeBoardPermission } from "../middlewares/auth.middleware";
import {
  createBoard,
  getBoards,
  getBoardById,
  shareBoard,
  deleteBoard
} from "../controllers/boards.controller";

const router = Router();

router.use(authenticateJWT);

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:boardId", authorizeBoardPermission(["owner", "edit", "read"]), getBoardById);
router.post("/:boardId/share", authorizeBoardPermission(["owner"]), shareBoard);
router.delete("/:boardId", authorizeBoardPermission(["owner"]), deleteBoard);

export default router;
