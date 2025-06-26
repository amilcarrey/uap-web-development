// src/controllers/task.controller.js
const Task = require('../models/task.model');

module.exports = {
  createTask: async (req, res, next) => {
    try {
      const boardId = req.params.id;
      const { content } = req.body;
      const task = await Task.create({ boardId, content });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  listTasks: async (req, res, next) => {
    try {
      const boardId = req.params.id;
      const { page = 1, limit = 10, status, search } = req.query;
      const tasks = await Task.list({
        boardId,
        page:  Number(page),
        limit: Number(limit),
        status,
        search
      });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const taskId = req.params.taskId;
      const { content, status } = req.body;
      const task = await Task.update({ taskId, content, status });
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.taskId;
      await Task.remove({ taskId });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const tasks = await Task.listByBoard({
        boardId: req.params.id,
        page: Number(page),
        limit: Number(limit),
        status,
        search
      });
      res.json(tasks);
    } catch (err) {
      console.error('Error en task.list:', err);
      res.status(500).json({ error: 'Error al listar tareas' });
    }
  },

  // DELETE /boards/:id/tasks/completed
  deleteCompleted: async (req, res) => {
    try {
      const boardId = req.params.id;
      const count = await Task.removeCompleted({ boardId });
      res.json({ message: `${count} tareas completadas eliminadas` });
    } catch (err) {
      console.error('Error en task.deleteCompleted:', err);
      res
        .status(500)
        .json({ error: 'Error al eliminar tareas completadas' });
    }
  },

  searchTasks: async (req, res, next) => {
    try {
      const boardId = req.params.id;
      const { q } = req.query;
      const tasks = await Task.search({ boardId, query: q });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }
  
};
