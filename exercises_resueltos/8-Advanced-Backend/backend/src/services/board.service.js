const { Board, User, UserBoardPermission, sequelize } = require('../models');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Creates a new board for the given user.
 * The user becomes the owner of the board.
 * @param {object} boardData - Data for the new board (e.g., name).
 * @param {number} userId - The ID of the user creating the board.
 * @returns {Promise<Board>} The created board object.
 */
async function createBoard({ name }, userId) {
  if (!name || name.trim() === '') {
    throw new BadRequestError('Board name cannot be empty.');
  }

  let newBoard;
  const transaction = await sequelize.transaction();
  try {
    // Create the board
    newBoard = await Board.create({
      name,
      ownerId: userId,
    }, { transaction });

    // Assign 'owner' permission to the creator
    await UserBoardPermission.create({
      userId,
      boardId: newBoard.id,
      permissionLevel: 'owner',
    }, { transaction });

    await transaction.commit();
    return newBoard;
  } catch (error) {
    await transaction.rollback();
    // Log error if necessary
    throw error; // Re-throw error to be handled by controller
  }
}

/**
 * Gets all boards accessible to a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Board[]>} A list of boards.
 */
async function getAccessibleBoards(userId) {
  const userWithPermissions = await User.findByPk(userId, {
    include: [{
      model: Board,
      as: 'accessibleBoards', // This alias must match the one in User model association
      include: [ // Optionally include owner details for each board
        { model: User, as: 'owner', attributes: ['id', 'username', 'email'] }
      ]
    }],
  });

  if (!userWithPermissions) {
    throw new NotFoundError('User not found.');
  }
  return userWithPermissions.accessibleBoards || [];
}


/**
 * Gets a single board by its ID.
 * This service function assumes permission has already been checked by middleware.
 * @param {number} boardId - The ID of the board.
 * @returns {Promise<Board>} The board object with tasks and members.
 */
async function getBoardById(boardId) {
  const board = await Board.findByPk(boardId, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'username', 'email'] },
      // Tasks will be fetched via a separate endpoint with pagination/filtering
      // { model: Task, as: 'tasks' },
      {
        model: UserBoardPermission,
        as: 'permissions',
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
      }
    ]
  });
  if (!board) { // Should be caught by middleware, but good to have a check
    throw new NotFoundError(`Board not found with ID ${boardId}.`);
  }
  return board;
}

/**
 * Updates a board's details.
 * Requires 'owner' or 'editor' permission (this should be enforced by middleware before calling).
 * @param {number} boardId - The ID of the board to update.
 * @param {object} updateData - Data to update (e.g., name).
 * @param {User} requestingUser - The user making the request (from req.user).
 * @param {string} userPermissionLevel - The permission level of the user for this board (from req.permissionLevel).
 * @returns {Promise<Board>} The updated board object.
 */
async function updateBoard(boardId, { name }, requestingUser, userPermissionLevel) {
  // Permission check should ideally be in middleware or controller calling this service
  // For this example, we assume checkBoardPermission('editor') was called.
  // const board = await Board.findByPk(boardId);
  // if (!board) throw new NotFoundError(`Board not found with ID ${boardId}`);
  // No need to re-fetch, board is on req.board from checkBoardPermission middleware

  if (name !== undefined && (name === null || name.trim() === '')) {
    throw new BadRequestError('Board name cannot be empty.');
  }

  // The board instance is available via req.board from the checkBoardPermission middleware
  // For this service function, let's assume boardId is passed and we fetch it if needed,
  // or rely on the controller to pass the instance.
  // For simplicity, we'll use the boardId and assume the controller passes a validated board instance or ID.

  const boardToUpdate = await Board.findByPk(boardId); // Re-fetch to ensure we have the latest
  if (!boardToUpdate) {
      throw new NotFoundError(`Board not found with ID ${boardId}`);
  }

  // Only name is updatable for now
  if (name !== undefined) {
    boardToUpdate.name = name;
  }

  await boardToUpdate.save();
  return boardToUpdate;
}

/**
 * Deletes a board.
 * Requires 'owner' permission.
 * @param {number} boardId - The ID of the board to delete.
 * @param {User} requestingUser - The user making the request.
 * @param {string} userPermissionLevel - The permission level of the user for this board.
 * @returns {Promise<void>}
 */
async function deleteBoard(boardId, requestingUser, userPermissionLevel) {
  // Permission check should be in middleware (checkBoardPermission('owner'))
  // const board = await Board.findByPk(boardId);
  // if (!board) throw new NotFoundError(`Board not found with ID ${boardId}`);
  // if (board.ownerId !== requestingUser.id) {
  //   throw new ForbiddenError('Only the board owner can delete the board.');
  // }

  // UserBoardPermissions and Tasks associated with this board will be CASCADE deleted
  // due to model definitions if onDelete: 'CASCADE' is set.
  // Otherwise, they need to be manually deleted here or handled by DB constraints.
  // Our models have onDelete: 'CASCADE' for UserBoardPermission->boardId and Task->boardId.

  const boardToDelete = await Board.findByPk(boardId);
    if (!boardToDelete) {
        throw new NotFoundError(`Board not found with ID ${boardId}`);
    }

  await boardToDelete.destroy(); // This will trigger cascade deletes if configured
}


module.exports = {
  createBoard,
  getAccessibleBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
