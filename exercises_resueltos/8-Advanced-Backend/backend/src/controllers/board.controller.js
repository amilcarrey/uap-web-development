const boardService = require('../services/board.service');
const { asyncHandler } = require('./auth.controller'); // Re-using asyncHandler

const createBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // From 'protect' middleware

  const board = await boardService.createBoard({ name }, userId);
  res.status(201).json({
    status: 'success',
    data: { board },
  });
});

const getMyBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const boards = await boardService.getAccessibleBoards(userId);
  res.status(200).json({
    status: 'success',
    results: boards.length,
    data: { boards },
  });
});

const getBoard = asyncHandler(async (req, res) => {
  // req.board is attached by checkBoardPermission middleware
  // We can fetch more details if needed, or the service can do that.
  const boardWithDetails = await boardService.getBoardById(req.board.id);
  res.status(200).json({
    status: 'success',
    data: { board: boardWithDetails },
  });
});

const updateBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const boardId = req.board.id; // From checkBoardPermission middleware

  // The permission check (e.g., 'editor') is handled by checkBoardPermission in the route
  const updatedBoard = await boardService.updateBoard(boardId, { name }, req.user, req.permissionLevel);
  res.status(200).json({
    status: 'success',
    data: { board: updatedBoard },
  });
});

const deleteBoard = asyncHandler(async (req, res) => {
  const boardId = req.board.id; // From checkBoardPermission middleware

  // The permission check (e.g., 'owner') is handled by checkBoardPermission in the route
  await boardService.deleteBoard(boardId, req.user, req.permissionLevel);
  res.status(204).json({ // 204 No Content for successful deletion
    status: 'success',
    data: null,
  });
});

module.exports = {
  createBoard,
  getMyBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
