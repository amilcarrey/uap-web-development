const taskService = require('../services/task.service');
const { asyncHandler } = require('./auth.controller'); // Re-using asyncHandler
const { BadRequestError } = require('../utils/errors');


const createTask = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const { title, description, status, dueDate } = req.body;
  const userId = req.user.id; // From 'protect' middleware

  // Permission to edit board (checked by checkBoardPermission('editor') on the router)
  // is implicitly permission to create tasks.

  const task = await taskService.createTask(boardId, { title, description, status, dueDate }, userId);
  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

const getTasksForBoard = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  // Permission to view board (checked by checkBoardPermission('viewer') on the router)
  // is implicitly permission to view tasks.

  // Extract query params for pagination, filtering, sorting, searching
  const { page, limit, status, sortBy, sortOrder, searchTerm } = req.query;

  const result = await taskService.getTasksForBoard(boardId, {
    page,
    limit,
    status,
    sortBy,
    sortOrder,
    searchTerm,
  });

  res.status(200).json({
    status: 'success',
    results: result.tasks.length,
    totalTasks: result.totalTasks,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: { tasks: result.tasks },
  });
});

const getTask = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const taskId = parseInt(req.params.taskId, 10);

  // Permission to view board implies permission to view its tasks.
  const task = await taskService.getTaskById(taskId, boardId);
  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No update data provided.');
  }

  // Permission to edit board implies permission to edit its tasks.
  const updatedTask = await taskService.updateTask(taskId, boardId, updateData);
  res.status(200).json({
    status: 'success',
    data: { task: updatedTask },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);
  const taskId = parseInt(req.params.taskId, 10);

  // Permission to edit board implies permission to delete its tasks.
  await taskService.deleteTask(taskId, boardId);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const deleteCompletedTasks = asyncHandler(async (req, res) => {
  const boardId = parseInt(req.params.boardId, 10);

  // Permission to edit board implies permission to batch delete tasks.
  const result = await taskService.deleteCompletedTasks(boardId);
  res.status(200).json({ // Or 204 if you prefer for batch deletes that might do nothing
    status: 'success',
    message: `${result.count} completed tasks deleted.`,
    data: {
      deletedCount: result.count
    }
  });
});

module.exports = {
  createTask,
  getTasksForBoard,
  getTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
};
