import { Router } from "express";
import { BoardRepository } from "../modules/board/board.repository";
import { BoardService } from "../modules/board/board.service";
import { BoardController } from "../modules/board/board.controller";
import { authWithCookiesMiddleware, authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';

const router = Router();

// Inyección de dependencias
const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

// Middleware de autenticación para todas las rutas de boards
router.use(authWithCookiesMiddleware);

// Rutas para Boards
//router.get("/", boardController.getAllBoards);//aca tiene que ser una de get all boards by user

router.get("/user",boardController.getBoardsByUserId);
router.get("/:id", boardController.getBoardById);
router.post("/", boardController.createBoard);
router.delete("/:id",  boardController.deleteBoard);
router.post("/:id/invite",requirePermission(AccessLevel.owner), boardController.inviteUserToBoard);


//A POR VER
//POST	/api/boards/:id/invite	Invitar a usuario a tablero por nombre de usuario
export { router as boardRoutes };
