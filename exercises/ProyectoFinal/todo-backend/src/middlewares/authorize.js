// src/middlewares/authorize.js
const Permission = require('../models/permission.model');

/**
 * authorize(allowedRoles)
 * Comprueba que req.user.id tenga rol permitido para el tablero en req.params.id
 */
const authorize = allowedRoles => {
  return async (req, res, next) => {
    try {
      const userId  = req.user.id;
      const boardId = req.params.id;  // debe coincidir con /boards/:id

      const role = await Permission.getRole({ userId, boardId });

      if (!role || !allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ error: 'No tienes permiso para esta acción' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorize;
