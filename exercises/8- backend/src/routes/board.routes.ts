import { Router } from "express";
import { BoardController } from "../modules/board/board.controller";
import { BoardService } from "../modules/board/board.service";
import { BoardRepository } from "../modules/board/board.repository";
import { UserRepository } from "../modules/user/user.repository";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateBoardCreation,
  validateBoardUpdate,
  validateBoardSharing,
  validateRequest,
} from "../middleware/validation.middleware";

const router = Router();
const boardRepository = new BoardRepository();
const userRepository = new UserRepository();
const boardService = new BoardService(boardRepository, userRepository);
const boardController = new BoardController(boardService);

// All board routes require authentication
router.use(authenticateToken);

// Board CRUD operations
router.get("/", boardController.getAllBoards.bind(boardController));
router.post(
  "/",
  validateBoardCreation,
  validateRequest,
  boardController.createBoard.bind(boardController)
);
router.get("/:id", boardController.getBoardById.bind(boardController));
router.put(
  "/:id",
  validateBoardUpdate,
  validateRequest,
  boardController.updateBoard.bind(boardController)
);
router.delete("/:id", boardController.deleteBoard.bind(boardController));

// Board sharing and permissions
router.post(
  "/:id/share",
  validateBoardSharing,
  validateRequest,
  boardController.shareBoard.bind(boardController)
);
router.delete(
  "/:id/permissions/:userId",
  boardController.removeBoardAccess.bind(boardController)
);
router.get(
  "/:id/permissions",
  boardController.getBoardPermissions.bind(boardController)
);

export default router;
