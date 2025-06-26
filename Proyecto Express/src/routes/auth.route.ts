import { Router } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { BoardService } from "../modules";
import { BoardRepository } from "../modules/board/board.repository";

const router = Router();

const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository, boardService);
const authController = new AuthController(authService);

router.get("/", authController.getAllUsers);
router.post("/register", authController.createUser);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export { router as authRoutes };