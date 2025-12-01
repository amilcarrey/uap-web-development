import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest, validateBoardCreation, validateTodoCreation } from '../middleware/validation.middleware';
import { body } from 'express-validator';
import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';
import { AuthRepository } from '../modules/auth/auth.repository';
import { PermissionController } from '../modules/permissions/permission.controller';
import { PermissionsService } from '../modules/permissions/permission.service';
import { PermissionRepository } from '../modules/permissions/permission.repository';

const router = Router();

// Validaciones para registro
const validateRegister: RequestHandler[] = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be 3-20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and numbers'),
    validateRequest as RequestHandler
];

// Validaciones para login
const validateLogin: RequestHandler[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validateRequest as RequestHandler
];

// Validaciones para configuraciones
const validateSettings: RequestHandler[] = [
    body('refresh_interval')
        .optional()
        .isInt({ min: 1000, max: 300000 })
        .withMessage('Refresh interval must be between 1000ms and 300000ms'),
    body('uppercase_descriptions')
        .optional()
        .isBoolean()
        .withMessage('uppercase_descriptions must be a boolean'),
    body('todos_per_page')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Todos per page must be between 1 and 100'),
    validateRequest as RequestHandler
];

// Inicializar servicios
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const permissionRepository = new PermissionRepository();
const permissionsService = new PermissionsService(permissionRepository, authRepository);
const permissionController = new PermissionController(permissionsService);

// Rutas públicas (sin autenticación)
router.post('/register', validateRegister, authController.register.bind(authController));
router.post('/login', validateLogin, authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Rutas protegidas (requieren autenticación)
router.get('/me', authenticateToken as RequestHandler, authController.me.bind(authController));
router.get('/users', authenticateToken as RequestHandler, authController.getAllUsers.bind(authController));
router.get('/settings', authenticateToken as RequestHandler, authController.getUserSettings.bind(authController));
router.put('/settings', authenticateToken as RequestHandler, validateSettings, authController.updateUserSettings.bind(authController));

// Ruta para obtener tableros del usuario
router.get('/boards', authenticateToken as RequestHandler, permissionController.getUserBoards.bind(permissionController));

export default router;