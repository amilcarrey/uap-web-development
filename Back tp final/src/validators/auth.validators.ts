import { body, param } from 'express-validator';
import { AuthRepository } from '../modules';

/**
 * Validadores para autenticación
 */


export const authValidators = {
  // Validación para login/register
  credentials: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('El nombre debe tener entre 3 y 30 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('El nombre solo puede contener letras, números y guiones bajos')
      .escape(), // Sanitización

    body('password')
      .isLength({ min: 6, max: 100 })
      .withMessage('La contraseña debe tener entre 6 y 100 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número')
  ],

  // Validación solo para login (menos estricta)
  login: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .escape(),

    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
  ]
};
