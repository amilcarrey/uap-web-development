import { body, param } from 'express-validator';

/**
 * Validadores para configuraciones de usuario
 */
export const userSettingsValidators = {
  // Validación para actualizar configuraciones
  update: [
    body('refresh_interval')
      .optional()
      .isInt({ min: 5, max: 300 })
      .withMessage('El intervalo de actualización debe ser entre 5 y 300 segundos')
      .toInt(), // Sanitización

    body('show_uppercase')
      .optional()
      .isBoolean()
      .withMessage('El campo show_uppercase debe ser booleano')
      .toBoolean()
  ],

  // Validación para user_id en parámetros
  userId: [
    param('user_id')
      .trim()
      .notEmpty()
      .withMessage('ID de usuario es requerido')
      .isLength({ min: 1, max: 36 })
      .withMessage('ID de usuario inválido')
      .escape()
  ]
};
