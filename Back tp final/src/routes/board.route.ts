import { Router } from "express";
import { BoardRepository } from "../modules/board/board.repository";
import { BoardService } from "../modules/board/board.service";
import { BoardController } from "../modules/board/board.controller";
import { authWithCookiesMiddleware, authWithHeadersMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/permission.middleware';
import { AccessLevel } from '../enum/access-level.enum';
import { boardValidators, handleValidationErrors } from "../validators";

const router = Router();

// Inyección de dependencias
const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

// Middleware de autenticación para todas las rutas de boards
router.use(authWithCookiesMiddleware);

// Rutas para Boards
//router.get("/", boardController.getAllBoards);//aca tiene que ser una de get all boards by user
router.post("/invite-user/:board_id", 
  boardValidators.inviteUser, 
  handleValidationErrors, 
  requirePermission(AccessLevel.owner), 
  boardController.inviteUser
);
router.get("/user", boardController.getBoardsByUserId);
router.get("/:id", 
  boardValidators.boardId, 
  handleValidationErrors, 
  boardController.getBoardById
);
router.post("/", 
  boardValidators.create, 
  handleValidationErrors, 
  boardController.createBoard
);
router.delete("/:id", 
  boardValidators.boardId, 
  handleValidationErrors, 
  boardController.deleteBoard
);



//A POR VER
//POST	/api/boards/:id/invite	Invitar a usuario a tablero por nombre de usuario
export { router as boardRoutes };
