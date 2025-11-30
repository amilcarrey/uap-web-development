const { Task, Board, UserBoardPermission } = require('../models');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Creates a new task for a given board.
 * Assumes user has 'editor' or 'owner' permission on the board (checked by middleware).
 * @param {number} boardId - The ID of the board.
 * @param {object} taskData - Data for the new task (title, description, status, dueDate).
 * @param {number} userId - The ID of the user creating the task (for tracking or if needed).
 * @returns {Promise<Task>} The created task object.
 */
async function createTask(boardId, { title, description, status, dueDate }, userId) {
  if (!title || title.trim() === '') {
    throw new BadRequestError('Task title cannot be empty.');
  }

  // Board existence and user's permission to access/edit the board should be pre-verified
  // by `checkBoardPermission('editor')` middleware before this service function is called.

  const task = await Task.create({
    boardId,
    title,
    description,
    status: status || 'todo', // Default status if not provided
    dueDate,
    // createdById: userId, // Optional: if you add this field to Task model
  });
  return task;
}

/**
 * Gets tasks for a specific board with pagination, filtering, and searching.
 * Assumes user has 'viewer', 'editor', or 'owner' permission on the board.
 * @param {number} boardId - The ID of the board.
 * @param {object} queryOptions - Options for pagination, filtering, and searching.
 *   - {number} page - Current page number.
 *   - {number} limit - Number of tasks per page.
 *   - {string} status - Filter by task status.
 *   - {string} sortBy - Field to sort by (e.g., 'createdAt', 'dueDate', 'title').
 *   - {string} sortOrder - 'ASC' or 'DESC'.
 *   - {string} searchTerm - Search term for title or description.
 * @returns {Promise<{tasks: Task[], totalTasks: number, totalPages: number, currentPage: number}>}
 */
async function getTasksForBoard(boardId, queryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    searchTerm,
  } = queryOptions;

  const offset = (page - 1) * limit;
  const whereClause = { boardId };

  if (status) {
    // If status is a comma-separated list (e.g., "todo,in-progress")
    if (status.includes(',')) {
      whereClause.status = { [Op.in]: status.split(',').map(s => s.trim()).filter(s => s) };
    } else {
      whereClause.status = status;
    }
  }

  if (searchTerm) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm}%` } },
      { description: { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  const { count, rows } = await Task.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
    // include: [{ model: User, as: 'assignee', attributes: ['id', 'username'] }] // If assignee exists
  });

  return {
    tasks: rows,
    totalTasks: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
  };
}

/**
 * Gets a single task by its ID.
 * Assumes user has permission to view the board the task belongs to.
 * @param {number} taskId - The ID of the task.
 * @param {number} boardId - The ID of the board (passed from controller to ensure context).
 * @returns {Promise<Task>} The task object.
 */
async function getTaskById(taskId, boardId) {
  const task = await Task.findOne({
    where: {
      id: taskId,
      boardId: boardId // Ensure task belongs to the specified board from URL
    }
  });
  if (!task) {
    throw new NotFoundError(`Task not found with ID ${taskId} on board ${boardId}.`);
  }
  return task;
}

/**
 * Updates a task's details.
 * Assumes user has 'editor' or 'owner' permission on the board.
 * @param {number} taskId - The ID of the task to update.
 * @param {number} boardId - The ID of the board the task belongs to.
 * @param {object} updateData - Data to update (title, description, status, dueDate).
 * @returns {Promise<Task>} The updated task object.
 */
async function updateTask(taskId, boardId, updateData) {
  const task = await Task.findOne({
    where: {
      id: taskId,
      boardId: boardId
    }
  });

  if (!task) {
    throw new NotFoundError(`Task not found with ID ${taskId} on board ${boardId}.`);
  }

  // Prevent boardId from being changed directly
  if (updateData.boardId && updateData.boardId !== task.boardId) {
    throw new BadRequestError('Cannot change the board ID of a task directly. Move task if needed.');
  }

  const allowedUpdates = ['title', 'description', 'status', 'dueDate'];
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      // Special handling for empty title if that's not allowed
      if (key === 'title' && (updateData[key] === null || updateData[key].trim() === '')) {
          throw new BadRequestError('Task title cannot be empty.');
      }
      task[key] = updateData[key];
    }
  });

  await task.save();
  return task;
}

/**
 * Deletes a task.
 * Assumes user has 'editor' or 'owner' permission on the board.
 * @param {number} taskId - The ID of the task to delete.
 * @param {number} boardId - The ID of the board the task belongs to.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId, boardId) {
  const task = await Task.findOne({
    where: {
      id: taskId,
      boardId: boardId
    }
  });

  if (!task) {
    throw new NotFoundError(`Task not found with ID ${taskId} on board ${boardId}.`);
  }
  await task.destroy();
}

/**
 * Deletes all completed tasks for a given board in bulk.
 * Assumes user has 'editor' or 'owner' permission on the board.
 * @param {number} boardId - The ID of the board.
 * @returns {Promise<{ count: number }>} The number of tasks deleted.
 */
async function deleteCompletedTasks(boardId) {
  const result = await Task.destroy({
    where: {
      boardId,
      status: 'done',
    },
  });
  return { count: result }; // result is the number of rows deleted
}

module.exports = {
  createTask,
  getTasksForBoard,
  getTaskById,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
};
