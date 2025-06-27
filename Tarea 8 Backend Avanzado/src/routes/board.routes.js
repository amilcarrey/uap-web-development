const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  getUserBoards,
  createBoard,
  deleteBoard,
  shareBoard
} = require("../controllers/board.controller");

router.use(authMiddleware); // protege todas las rutas

router.get("/", getUserBoards);
router.post("/", createBoard);
router.delete("/:id", deleteBoard);
router.post("/share", shareBoard);

module.exports = router;
