const express = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes in this file are for the authenticated user, so protect all.
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-specific operations (e.g., settings)
 * components:
 *   schemas:
 *     UserSetting:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *         autoUpdateInterval:
 *           type: integer
 *           description: Interval in seconds for auto-updates.
 *           example: 300
 *         taskVisualizationPrefs:
 *           type: object
 *           description: Preferences for how tasks are displayed.
 *           example: { "viewMode": "list", "showCompleted": true, "sortOrder": "dueDate" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UpdateUserSettings:
 *       type: object
 *       properties:
 *         autoUpdateInterval:
 *           type: integer
 *           description: Interval in seconds for auto-updates.
 *           example: 600
 *         taskVisualizationPrefs:
 *           type: object
 *           description: Preferences for how tasks are displayed.
 *           example: { "viewMode": "kanban", "showCompleted": false }
 */

router.route('/settings')
  /**
   * @swagger
   * /api/v1/user/settings:
   *   get:
   *     summary: Get the current user's application settings
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: User settings retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: "success" }
   *                 data:
   *                   type: object
   *                   properties:
   *                     settings: { $ref: '#/components/schemas/UserSetting' }
   *       401:
   *         description: Unauthorized (not logged in)
   */
  .get(userController.getUserSettings)
  /**
   * @swagger
   * /api/v1/user/settings:
   *   put:
   *     summary: Update the current user's application settings
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/UpdateUserSettings' }
   *     responses:
   *       200:
   *         description: User settings updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: "success" }
   *                 message: { type: string, example: "Settings updated successfully." }
   *                 data:
   *                   type: object
   *                   properties:
   *                     settings: { $ref: '#/components/schemas/UserSetting' }
   *       400:
   *         description: Bad request (e.g., invalid settings format)
   *       401:
   *         description: Unauthorized (not logged in)
   */
  .put(userController.updateUserSettings);

// Potential future user-specific routes:
// router.get('/profile', userController.getProfile);
// router.put('/profile', userController.updateProfile);
// router.put('/change-password', authController.changePassword); // If separate from auth routes

module.exports = router;
