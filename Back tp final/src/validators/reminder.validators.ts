import { body, param } from 'express-validator';

/**
 * Validadores para recordatorios
 */
export const reminderValidators = {
  // Validación para crear/actualizar recordatorio
  create: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre del recordatorio debe tener entre 1 y 100 caracteres')
      .escape(),

    body('completed')
      .optional()
      .isBoolean()
      .withMessage('El campo completed debe ser booleano')
      .toBoolean(), // Sanitización

    body('board_id')
      .isUUID()
      .withMessage('ID de board inválido')
      .escape()
  ],

  // Validación para actualizar recordatorio
  update: [
    param('id')
      .isUUID()
      .withMessage('ID de recordatorio inválido')
      .escape(),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre del recordatorio debe tener entre 1 y 100 caracteres')
      .escape(),

    body('completed')
      .optional()
      .isBoolean()
      .withMessage('El campo completed debe ser booleano')
      .toBoolean()
  ],

  // Validación para parámetros ID
  reminderId: [
    param('id')
      .isUUID()
      .withMessage('ID de recordatorio inválido')
      .escape()
  ]
};
