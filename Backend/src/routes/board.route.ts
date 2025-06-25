import { Router } from "express";
import { BoardController } from "../modules/board/board.controller";
import { BoardService } from "../modules/board/board.service";
import { BoardRepository } from "../modules/board/board.repository";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { canManageBoardUsers } from "../middleware/permissions.middleware";

const router = Router();

// Crear las instancias necesarias
const boardRepository = new BoardRepository();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const boardService = new BoardService(boardRepository, authService);
const boardController = new BoardController(boardService);
const boardPermissions = canManageBoardUsers(boardService);

router.use(authMiddleware);

router.post("/", boardController.createBoard);
router.get("/", boardController.getUserBoards);
router.get("/:id", boardController.getBoardById);
router.delete("/:id", boardController.deleteBoard);

router.get("/:id/users", boardController.getBoardUsers);
router.post("/:id/users", boardPermissions,boardController.addUserToBoard);
router.delete("/:id/users/:userId", boardPermissions,boardController.removeUserFromBoard);

export default router;