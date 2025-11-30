const express = require('express');
const boardController = require('../controllers/board.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkBoardPermission } = require('../middlewares/permission.middleware');
const taskRouter = require('./task.routes');
const permissionController = require('../controllers/permission.controller'); // Import permission controller

const router = express.Router();

// Apply 'protect' middleware to all routes in this file
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Board management operations
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *   schemas:
 *     Board:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         ownerId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               boardId:
 *                 type: integer
 *               permissionLevel:
 *                 type: string
 *                 enum: [owner, editor, viewer]
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 */

// Route for creating a new board and getting all accessible boards for the current user
router.route('/')
  /**
   * @swagger
   * /api/v1/boards:
   *   post:
   *     summary: Create a new board
   *     tags: [Boards]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name]
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Board created successfully
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Board' }
   *       400:
   *         description: Bad request (e.g., missing name)
   *       401:
   *         description: Unauthorized (not logged in)
   */
  .post(boardController.createBoard)
  /**
   * @swagger
   * /api/v1/boards:
   *   get:
   *     summary: Get all boards accessible to the current user
   *     tags: [Boards]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: A list of accessible boards
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Board' }
   *       401:
   *         description: Unauthorized (not logged in)
   */
  .get(boardController.getMyBoards);

// Routes for a specific board
router.route('/:boardId')
  /**
   * @swagger
   * /api/v1/boards/{boardId}:
   *   get:
   *     summary: Get a specific board by ID
   *     tags: [Boards]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The board ID
   *     responses:
   *       200:
   *         description: Board data
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Board' }
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden (no access to this board)
   *       404:
   *         description: Board not found
   */
  .get(checkBoardPermission('viewer'), boardController.getBoard)
  /**
   * @swagger
   * /api/v1/boards/{boardId}:
   *   put:
   *     summary: Update a board's details (e.g., name)
   *     tags: [Boards]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Board updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden (no permission to edit)
   *       404:
   *         description: Board not found
   */
  .put(checkBoardPermission('editor'), boardController.updateBoard)
  /**
   * @swagger
   * /api/v1/boards/{boardId}:
   *   delete:
   *     summary: Delete a board
   *     tags: [Boards]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Board deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden (only owner can delete)
   *       404:
   *         description: Board not found
   */
  .delete(checkBoardPermission('owner'), boardController.deleteBoard);

// Nested routes for tasks within a board
// Mount the task router for paths like /api/v1/boards/:boardId/tasks
// The protect middleware is already applied at the beginning of this board router.
// The taskRouter itself now handles specific board permission checks for its routes.
router.use('/:boardId/tasks', taskRouter);

// --- Routes for Managing Board Permissions ---

/**
 * @swagger
 * /api/v1/boards/{boardId}/permissions:
 *   get:
 *     summary: Get all users and their permissions for a board
 *     tags: [Boards, Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of permissions }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (user is not owner or editor of the board) }
 *       404: { description: Board not found }
 */
router.get('/:boardId/permissions', checkBoardPermission('editor'), permissionController.getBoardPermissions); // Owner or editor can see permissions

/**
 * @swagger
 * /api/v1/boards/{boardId}/share:
 *   post:
 *     summary: Share a board with another user
 *     tags: [Boards, Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, permissionLevel]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to share with
 *               permissionLevel:
 *                 type: string
 *                 enum: [editor, viewer]
 *                 description: Permission level to grant
 *     responses:
 *       201: { description: Board shared successfully }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (only owner can share) }
 *       404: { description: Board or Target User not found }
 *       409: { description: Conflict (user already has this permission) }
 */
router.post('/:boardId/share', checkBoardPermission('owner'), permissionController.shareBoard);

/**
 * @swagger
 * /api/v1/boards/{boardId}/permissions/{userIdToManage}:
 *   put:
 *     summary: Update a user's permission for a board
 *     tags: [Boards, Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userIdToManage
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the user whose permission is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissionLevel]
 *             properties:
 *               permissionLevel:
 *                 type: string
 *                 enum: [editor, viewer]
 *     responses:
 *       200: { description: Permission updated successfully }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (only owner can update permissions) }
 *       404: { description: Board or User permission not found }
 */
router.put('/:boardId/permissions/:userIdToManage', checkBoardPermission('owner'), permissionController.updateUserPermission);

/**
 * @swagger
 * /api/v1/boards/{boardId}/permissions/{userIdToManage}:
 *   delete:
 *     summary: Remove a user's access to a board
 *     tags: [Boards, Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userIdToManage
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the user whose access is being removed
 *     responses:
 *       200: { description: User removed successfully }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (only owner can remove users) }
 *       404: { description: Board or User permission not found }
 */
router.delete('/:boardId/permissions/:userIdToManage', checkBoardPermission('owner'), permissionController.removeUserFromBoard);

module.exports = router;
