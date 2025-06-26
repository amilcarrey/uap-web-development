import { body, param } from 'express-validator';

/**
 * Validadores para permisos
 */
export const permissionValidators = {
  // Validación para crear/actualizar permisos
  create: [
    body('user_id')
      .trim()
      .notEmpty()
      .withMessage('ID de usuario es requerido')
      .isLength({ min: 1, max: 36 })
      .withMessage('ID de usuario inválido')
      .escape(),

    body('board_id')
      .isUUID()
      .withMessage('ID de board inválido')
      .escape(),

    body('access_level')
      .isIn(['owner', 'full_access', 'viewer'])
      .withMessage('Nivel de acceso debe ser: owner, full_access o viewer')
      .escape()
  ],

  // Validación para actualizar permisos
  update: [
    param('id')
      .isUUID()
      .withMessage('ID de permiso inválido')
      .escape(),

    body('access_level')
      .isIn(['owner', 'full_access', 'viewer'])
      .withMessage('Nivel de acceso debe ser: owner, full_access o viewer')
      .escape()
  ],

  // Validación para ID de permiso
  permissionId: [
    param('id')
      .isUUID()
      .withMessage('ID de permiso inválido')
      .escape()
  ]
};
