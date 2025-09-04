import express from "express";
import { BoardController } from "./board.controller";
import { authWithHeadersMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();
const controller = new BoardController();

router.get("/", authWithHeadersMiddleware, controller.getAllBoards);
router.get("/:id", authWithHeadersMiddleware, controller.getBoardById);
router.post("/", authWithHeadersMiddleware, controller.createBoard);
router.delete("/:id", authWithHeadersMiddleware, controller.deleteBoard);

export { router as boardRoutes };
