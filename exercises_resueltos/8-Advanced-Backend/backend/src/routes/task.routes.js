const express = require('express');
const taskController = require('../controllers/task.controller');
const { checkBoardPermission } = require('../middlewares/permission.middleware'); // To re-check/specify permission if needed at task level

// Create a router instance with mergeParams: true to access :boardId from parent router
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations within a board
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         boardId:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NewTask:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *           default: todo
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     UpdateTask:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

// Base routes for tasks within a board (e.g., /api/v1/boards/:boardId/tasks)
router.route('/')
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks:
   *   post:
   *     summary: Create a new task within a board
   *     tags: [Tasks]
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
   *           schema: { $ref: '#/components/schemas/NewTask' }
   *     responses:
   *       201: { description: Task created, content: { application/json: { schema: { $ref: '#/components/schemas/Task' } } } }
   *       400: { description: Bad request }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden (no permission to edit board) }
   *       404: { description: Board not found }
   */
  .post(checkBoardPermission('editor'), taskController.createTask) // User needs to be at least editor of the board
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks:
   *   get:
   *     summary: Get all tasks for a specific board (with pagination, filtering, search)
   *     tags: [Tasks]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema: { type: integer }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 10 }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [todo, in-progress, done] }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, enum: [createdAt, dueDate, title, status], default: createdAt }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [ASC, DESC], default: DESC }
   *       - in: query
   *         name: searchTerm
   *         schema: { type: string }
   *     responses:
   *       200: { description: List of tasks, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Task' } } } } }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden (no permission to view board) }
   *       404: { description: Board not found }
   */
  .get(checkBoardPermission('viewer'), taskController.getTasksForBoard); // User needs to be at least viewer of the board

// Route for batch deleting completed tasks
router.route('/completed')
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks/completed:
   *   delete:
   *     summary: Delete all completed tasks for a board in bulk
   *     tags: [Tasks]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200: { description: Completed tasks deleted, returns count }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden (no permission to edit board) }
   *       404: { description: Board not found }
   */
  .delete(checkBoardPermission('editor'), taskController.deleteCompletedTasks); // User needs to be at least editor


// Routes for a specific task within a board (e.g., /api/v1/boards/:boardId/tasks/:taskId)
router.route('/:taskId')
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks/{taskId}:
   *   get:
   *     summary: Get a specific task by ID
   *     tags: [Tasks]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema: { type: integer }
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200: { description: Task data, content: { application/json: { schema: { $ref: '#/components/schemas/Task' } } } }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden }
   *       404: { description: Board or Task not found }
   */
  .get(checkBoardPermission('viewer'), taskController.getTask) // User needs to be at least viewer
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks/{taskId}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema: { type: integer }
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/UpdateTask' }
   *     responses:
   *       200: { description: Task updated, content: { application/json: { schema: { $ref: '#/components/schemas/Task' } } } }
   *       400: { description: Bad request }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden }
   *       404: { description: Board or Task not found }
   */
  .put(checkBoardPermission('editor'), taskController.updateTask) // User needs to be at least editor
  /**
   * @swagger
   * /api/v1/boards/{boardId}/tasks/{taskId}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: boardId
   *         required: true
   *         schema: { type: integer }
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       204: { description: Task deleted successfully }
   *       401: { description: Unauthorized }
   *       403: { description: Forbidden }
   *       404: { description: Board or Task not found }
   */
  .delete(checkBoardPermission('editor'), taskController.deleteTask); // User needs to be at least editor

module.exports = router;
