import { body, param } from 'express-validator';

/**
 * Validadores para boards
 */
export const boardValidators = {
  // Validación para crear board
  create: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre del board debe tener entre 1 y 100 caracteres')
      .escape(), // Sanitización para prevenir XSS

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
      .escape()
  ],

  // Validación para parámetros de board ID
  boardId: [
    param('id')
      .isUUID()
      .withMessage('ID de board inválido')
      .escape(),

    param('board_id')
      .optional()
      .isUUID()
      .withMessage('ID de board inválido')
      .escape()
  ],

  // Validación para invitar usuario
  inviteUser: [
    param('board_id')
      .isUUID()
      .withMessage('ID de board inválido')
      .escape(),

    body('user_id')
      .trim()
      .notEmpty()
      .withMessage('ID de usuario es requerido')
      .isLength({ min: 1, max: 36 })
      .withMessage('ID de usuario inválido')
      .escape(),

    body('access_level')
      .isIn(['owner', 'full_access', 'viewer'])
      .withMessage('Nivel de acceso debe ser: owner, full_access o viewer')
      .escape()
  ]
};
