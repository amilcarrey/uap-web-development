const { User, Board, UserBoardPermission, sequelize } = require('../models');
const { NotFoundError, BadRequestError, ConflictError, ForbiddenError } = require('../utils/errors');

/**
 * Shares a board with another user.
 * Only the board owner can perform this action.
 * @param {number} boardId - The ID of the board to share.
 * @param {string} targetUserEmail - The email of the user to share the board with.
 * @param {'editor' | 'viewer'} permissionLevel - The permission level to grant.
 * @param {number} requestingUserId - The ID of the user performing the share action (must be owner).
 * @returns {Promise<UserBoardPermission>} The created permission object.
 */
async function shareBoard(boardId, targetUserEmail, permissionLevel, requestingUserId) {
  // Board owner check is handled by checkBoardPermission('owner') middleware in the route.
  // req.board will be available from that middleware.

  if (!targetUserEmail) {
    throw new BadRequestError('Target user email is required.');
  }
  if (!['editor', 'viewer'].includes(permissionLevel)) {
    throw new BadRequestError("Invalid permission level. Must be 'editor' or 'viewer'.");
  }

  const targetUser = await User.findOne({ where: { email: targetUserEmail } });
  if (!targetUser) {
    throw new NotFoundError(`User with email ${targetUserEmail} not found.`);
  }

  if (targetUser.id === requestingUserId) {
    throw new BadRequestError('Cannot share the board with yourself (you are the owner).');
  }

  // Check if permission already exists
  let existingPermission = await UserBoardPermission.findOne({
    where: { userId: targetUser.id, boardId },
  });

  if (existingPermission) {
    if (existingPermission.permissionLevel === permissionLevel) {
      throw new ConflictError(`User already has '${permissionLevel}' permission for this board.`);
    }
    // If exists but different, update it (handled by updatePermission function or here)
    existingPermission.permissionLevel = permissionLevel;
    await existingPermission.save();
    return existingPermission;
  } else {
    const newPermission = await UserBoardPermission.create({
      userId: targetUser.id,
      boardId,
      permissionLevel,
    });
    return newPermission;
  }
}

/**
 * Updates a user's permission level for a board.
 * Only the board owner can perform this action.
 * @param {number} boardId - The ID of the board.
 * @param {number} targetUserId - The ID of the user whose permission is being updated.
 * @param {'editor' | 'viewer'} newPermissionLevel - The new permission level.
 * @param {number} requestingUserId - The ID of the user performing the update (must be owner).
 * @returns {Promise<UserBoardPermission>} The updated permission object.
 */
async function updateUserPermission(boardId, targetUserId, newPermissionLevel, requestingUserId) {
  // Board owner check by middleware.
  if (targetUserId === requestingUserId) {
    throw new BadRequestError("Cannot change your own permission level as owner. Owners always have 'owner' permission.");
  }
  if (!['editor', 'viewer'].includes(newPermissionLevel)) {
    throw new BadRequestError("Invalid new permission level. Must be 'editor' or 'viewer'.");
  }

  const permission = await UserBoardPermission.findOne({
    where: { userId: targetUserId, boardId },
  });

  if (!permission) {
    throw new NotFoundError('User does not have any existing permission for this board to update.');
  }
  if (permission.permissionLevel === 'owner') {
      throw new ForbiddenError("Cannot change the permission level of an owner via this method.");
  }

  permission.permissionLevel = newPermissionLevel;
  await permission.save();
  return permission;
}

/**
 * Removes a user's access to a board.
 * Only the board owner can perform this action.
 * @param {number} boardId - The ID of the board.
 * @param {number} targetUserId - The ID of the user whose access is being removed.
 * @param {number} requestingUserId - The ID of the user performing the removal (must be owner).
 * @returns {Promise<void>}
 */
async function removeUserFromBoard(boardId, targetUserId, requestingUserId) {
  // Board owner check by middleware.
  if (targetUserId === requestingUserId) {
    throw new BadRequestError("Cannot remove yourself as the owner from the board.");
  }

  const permission = await UserBoardPermission.findOne({
    where: { userId: targetUserId, boardId },
  });

  if (!permission) {
    throw new NotFoundError('User does not have access to this board to remove.');
  }
  if (permission.permissionLevel === 'owner') {
    throw new ForbiddenError("Cannot remove an owner's permission via this method.");
  }

  await permission.destroy();
}

/**
 * Gets all users and their permissions for a specific board.
 * Useful for the board owner to see who has access.
 * Assumes checkBoardPermission('owner') or appropriate level has been applied.
 * @param {number} boardId The ID of the board.
 * @returns {Promise<UserBoardPermission[]>}
 */
async function getBoardPermissions(boardId) {
    const permissions = await UserBoardPermission.findAll({
        where: { boardId },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
        order: [['createdAt', 'ASC']],
    });
    return permissions;
}


module.exports = {
  shareBoard,
  updateUserPermission,
  removeUserFromBoard,
  getBoardPermissions,
};
