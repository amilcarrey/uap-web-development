const permissionService = require('../services/permission.service');
const { asyncHandler } = require('./auth.controller'); // Re-using asyncHandler
const { BadRequestError } = require('../utils/errors');

const shareBoard = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const { email: targetUserEmail, permissionLevel } = req.body;
  const requestingUserId = req.user.id; // from protect middleware

  // Board owner check is done by checkBoardPermission('owner') in the route
  // req.board is available from that middleware

  if (!targetUserEmail || !permissionLevel) {
    throw new BadRequestError('Target user email and permission level are required.');
  }

  const newPermission = await permissionService.shareBoard(
    boardId,
    targetUserEmail,
    permissionLevel,
    requestingUserId
  );

  res.status(201).json({
    status: 'success',
    message: `Board shared with ${targetUserEmail} as ${permissionLevel}.`,
    data: { permission: newPermission },
  });
});

const updateUserPermission = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  // userIdToManage is the ID of the user whose permission is being changed
  const userIdToManage = parseInt(req.params.userIdToManage, 10);
  const { permissionLevel: newPermissionLevel } = req.body;
  const requestingUserId = req.user.id;

  if (isNaN(userIdToManage)) {
      throw new BadRequestError('Invalid target user ID.');
  }
  if (!newPermissionLevel) {
    throw new BadRequestError('New permission level is required.');
  }

  const updatedPermission = await permissionService.updateUserPermission(
    boardId,
    userIdToManage,
    newPermissionLevel,
    requestingUserId
  );

  res.status(200).json({
    status: 'success',
    message: `User's permission updated to ${newPermissionLevel}.`,
    data: { permission: updatedPermission },
  });
});

const removeUserFromBoard = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const userIdToManage = parseInt(req.params.userIdToManage, 10);
  const requestingUserId = req.user.id;

  if (isNaN(userIdToManage)) {
    throw new BadRequestError('Invalid target user ID.');
  }

  await permissionService.removeUserFromBoard(
    boardId,
    userIdToManage,
    requestingUserId
  );

  res.status(200).json({ // Can also be 204 No Content
    status: 'success',
    message: 'User removed from board successfully.',
    data: null,
  });
});

const getBoardPermissions = asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId, 10);
    // checkBoardPermission('owner') or 'viewer'/'editor' depending on who can see this.
    // For now, let's assume 'owner' via route, but could be 'editor' too.
    const permissions = await permissionService.getBoardPermissions(boardId);
    res.status(200).json({
        status: 'success',
        results: permissions.length,
        data: { permissions }
    });
});

module.exports = {
  shareBoard,
  updateUserPermission,
  removeUserFromBoard,
  getBoardPermissions,
};
