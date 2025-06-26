// src/controllers/board.controller.js
const Board      = require('../models/board.model');
const Permission = require('../models/permission.model');

module.exports = {
  // Crear un nuevo tablero y asignar permiso de owner
  create: async (req, res, next) => {
    try {
      const { name } = req.body;
      const ownerId  = req.user.id;

      const board = await Board.create({ name, ownerId });
      await Permission.grant({
        userId:  ownerId,
        boardId: board.id,
        role:    'owner'
      });

      res.status(201).json(board);
    } catch (err) {
      next(err);
    }
  },

  // Listar tableros con logging para ver IDs
  list: async (req, res, next) => {
    console.log('👉 En list, usuario:', req.user.id);
    try {
      const boards = await Board.listByUser(req.user.id);
      console.log('👉 Tableros encontrados:', boards);
      res.json(boards);
    } catch (err) {
      next(err);
    }
  },

  // Obtener detalle de un tablero
  getById: async (req, res, next) => {
    console.log('👉 En getById, params.id =', req.params.id);
    try {
      const board = await Board.getById(req.params.id);
      res.json(board);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar nombre de un tablero
  update: async (req, res, next) => {
    try {
      const { name } = req.body;
      const board = await Board.update({ id: req.params.id, name });
      res.json(board);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar un tablero
  remove: async (req, res, next) => {
    try {
      await Board.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  // Compartir tablero con otro usuario
  share: async (req, res, next) => {
    try {
      const { userId, role } = req.body;
      await Permission.grant({
        userId,
        boardId: req.params.id,
        role
      });
      res.json({ message: 'Permiso asignado' });
    } catch (err) {
      next(err);
    }
  }
};
