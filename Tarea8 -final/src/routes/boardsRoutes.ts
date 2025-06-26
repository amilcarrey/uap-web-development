import { Router } from "express";
import {
  createBoard,
  getMyBoards,
  shareBoard,
  getBoardPermissions,
  updateBoardPermission,
  removeBoardPermission,
  deleteBoard
} from "../controllers/boardsController";

const router = Router();


router.post("/", createBoard);
router.get("/", getMyBoards);
router.post("/share", shareBoard);
router.get("/:id/permissions", getBoardPermissions);
router.post("/:id/permissions", updateBoardPermission);
router.delete("/:id/permissions/:targetUserId", removeBoardPermission);
router.delete("/:id", deleteBoard);
export default router;
