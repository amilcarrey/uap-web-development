import { Router } from "express";
import { BoardRepository } from "../modules/board/board.repository";
import { BoardService } from "../modules/board/board.service";
import { BoardController } from "../modules/board/board.controller";
import { authWithCookiesMiddleware } from "../middleware/auth.middleware";

const router = Router();
const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

router.use(authWithCookiesMiddleware);

router.get("/", boardController.getAllBoards);
router.get("/:id", boardController.getBoardById);
router.post("/", boardController.createBoard);
router.delete("/:id", boardController.deleteBoard);
router.get("/:id/role", boardController.getBoardRole);
router.post("/share", boardController.shareBoard);

export { router as boardRoutes };