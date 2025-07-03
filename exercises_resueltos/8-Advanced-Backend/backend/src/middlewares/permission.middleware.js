const { Board, UserBoardPermission } = require('../models');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const asyncHandler = require('express-async-handler');

/**
 * Checks if the authenticated user has the required permission level for a specific board.
 * Attaches the board and the user's permission level to the request object.
 *
 * @param {('owner' | 'editor' | 'viewer')} requiredPermission - The minimum permission level required.
 * 'viewer' means any access, 'editor' means editor or owner, 'owner' means only owner.
 */
const checkBoardPermission = (requiredPermission) => asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // From 'protect' middleware
  const boardId = parseInt(req.params.boardId, 10);

  if (isNaN(boardId)) {
    return next(new NotFoundError('Board ID is invalid.'));
  }

  const board = await Board.findByPk(boardId);
  if (!board) {
    return next(new NotFoundError(`Board not found with ID ${boardId}.`));
  }

  // Find the user's permission for this board
  const userPermission = await UserBoardPermission.findOne({
    where: {
      userId,
      boardId,
    },
  });

  if (!userPermission) {
    // Special case: if board owner is the current user, but no explicit permission entry exists
    // This can happen if UserBoardPermission for owner wasn't created, though it should be.
    // For safety, we can check board.ownerId directly.
    if (board.ownerId === userId) {
        req.board = board;
        req.permissionLevel = 'owner'; // Implicit owner
    } else {
        return next(new ForbiddenError('You do not have access to this board.'));
    }
  } else {
    req.board = board; // Attach board to request for subsequent handlers
    req.permissionLevel = userPermission.permissionLevel; // Attach user's permission level
  }


  // Check if the user's permission level meets the required level
  const hasPermission = () => {
    const userLevel = req.permissionLevel;
    if (requiredPermission === 'viewer') {
      return ['viewer', 'editor', 'owner'].includes(userLevel);
    }
    if (requiredPermission === 'editor') {
      return ['editor', 'owner'].includes(userLevel);
    }
    if (requiredPermission === 'owner') {
      return userLevel === 'owner';
    }
    return false;
  };

  if (!hasPermission()) {
    return next(new ForbiddenError(`You do not have the required '${requiredPermission}' permission for this board.`));
  }

  next();
});

module.exports = { checkBoardPermission };
