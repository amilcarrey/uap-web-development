// import { Router } from 'express';
// import { BoardController } from '../modules/board/board.controller';
// import { BoardService } from '../modules/board/board.service';
// import { BoardRepository } from '../modules/board/board.repository';
// import { TodoController } from '../modules/todo/todo.controller';
// import { TodoService } from '../modules/todo/todo.service';
// import { TodoRepository } from '../modules/todo/todo.repository';


// const router = Router();

// // Inicializar dependencias de Board
// const boardRepository = new BoardRepository();
// const boardService = new BoardService(boardRepository);
// const boardController = new BoardController(boardService);

// // Inicializar dependencias de Todo
// const todoRepository = new TodoRepository();
// const todoService = new TodoService(todoRepository);
// const todoController = new TodoController(todoService);

// // Rutas de Boards
// router.get('/', boardController.getAllBoards);
// router.get('/:id', boardController.getBoardById);
// router.post('/', boardController.createBoard);
// router.put('/:id', boardController.updateBoard);
// router.delete('/:id', boardController.deleteBoard);

// // Rutas de Todos (anidadas bajo boards)
// router.get('/:boardId/todos', todoController.getAllTodos);
// router.post('/:boardId/todos', todoController.createTodo);
// router.delete('/:boardId/todos/clear-completed', todoController.clearCompletedTodos);
// router.get('/:boardId/todos/:id', todoController.getTodoById);
// router.patch('/:boardId/todos/:id', todoController.updateTodo);
// router.patch('/:boardId/todos/:id/toggle', todoController.toggleTodo);
// router.delete('/:boardId/todos/:id', todoController.deleteTodo);


// export default router;
import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
    requireBoardOwnership, 
    requireBoardEditPermission, 
    requireBoardViewPermission,
    injectBoardPermissions
} from '../middleware/permissions.middleware';
import { validateRequest, validateBoardCreation, validateTodoCreation } from '../middleware/validation.middleware';
import { body, param, query } from 'express-validator';

// Importar controladores (ajusta según tu estructura)
import { BoardController } from '../modules/board/board.controller';
import { TodoController } from '../modules/todo/todo.controller';
import { PermissionController } from '../modules/permissions/permission.controller';

// Inicializar servicios y controladores (ajusta según tu DI pattern)
import { BoardService } from '../modules/board/board.service';
import { BoardRepository } from '../modules/board/board.repository';
import { TodoService } from '../modules/todo/todo.service';
import { TodoRepository } from '../modules/todo/todo.repository';
import { PermissionsService } from '../modules/permissions/permission.service';
import { PermissionRepository } from '../modules/permissions/permission.repository';
import { AuthRepository } from '../modules/auth/auth.repository';

const router = Router();

// Inicializar dependencias
const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

const authRepository = new AuthRepository();
const permissionRepository = new PermissionRepository();
const permissionsService = new PermissionsService(permissionRepository, authRepository);
const permissionController = new PermissionController(permissionsService);

const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService, permissionsService);

// Validaciones adicionales
const validateBoardId: RequestHandler[] = [
    param('boardId').isInt({ min: 1 }).withMessage('Board ID must be a positive integer'),
    validateRequest as RequestHandler
];

const validateTodoId: RequestHandler[] = [
    param('id').isInt({ min: 1 }).withMessage('Todo ID must be a positive integer'),
    param('boardId').isInt({ min: 1 }).withMessage('Board ID must be a positive integer'),
    validateRequest as RequestHandler
];


const validateShareBoard: RequestHandler[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email'),
    body('permission_level')
        .isIn(['editor', 'viewer'])
        .withMessage('Permission level must be editor or viewer'),
    validateRequest as RequestHandler
];

const validateUpdatePermission: RequestHandler[] = [
    body('permission_level')
        .isIn(['editor', 'viewer'])
        .withMessage('Permission level must be editor or viewer'),
    param('boardId').isInt({ min: 1 }).withMessage('Board ID must be a positive integer'),
    param('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
    validateRequest as RequestHandler
];

const validateTodoQuery: RequestHandler[]  = [
    query('filter')
        .optional()
        .isIn(['all', 'completed', 'uncompleted'])
        .withMessage('Filter must be all, completed, or uncompleted'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Search term cannot exceed 100 characters'),
    validateRequest as RequestHandler
];

// TODAS las rutas requieren autenticación básica
router.use('/', authenticateToken as RequestHandler);

// Rutas de tableros
router.get('/', boardController.getAllBoards.bind(boardController));
router.get('/accessible', boardController.getAllUserBoards.bind(boardController));
router.post('/', validateBoardCreation, boardController.createBoard.bind(boardController));


// Rutas específicas de tableros 
router.get('/:boardId', validateBoardId, requireBoardViewPermission, boardController.getBoardById.bind(boardController));
router.put('/:boardId', validateBoardId, validateBoardCreation, requireBoardEditPermission, boardController.updateBoard.bind(boardController));
router.delete('/:boardId', validateBoardId, requireBoardOwnership, boardController.deleteBoard.bind(boardController));

// Rutas de permisos 
router.post('/:boardId/share', validateShareBoard, requireBoardOwnership, permissionController.shareBoard.bind(permissionController));
router.get('/:boardId/permissions', validateBoardId, requireBoardViewPermission, permissionController.getBoardPermissions.bind(permissionController));
router.put('/:boardId/permissions/:userId', validateUpdatePermission, requireBoardOwnership, permissionController.updatePermission.bind(permissionController));
router.delete('/:boardId/permissions/:userId', 
    [
        param('boardId').isInt({ min: 1 }).withMessage('Board ID must be a positive integer'),
        param('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
        validateRequest as RequestHandler
    ], 
    requireBoardOwnership, 
    permissionController.deletePermission.bind(permissionController)
);

// ✅ Rutas de todos con permisos según acción
router.get('/:boardId/todos', validateTodoQuery, requireBoardViewPermission, todoController.getAllTodos.bind(todoController));
router.post('/:boardId/todos', validateTodoCreation, requireBoardEditPermission, todoController.createTodo.bind(todoController));

// ⚠️ IMPORTANTE: Rutas específicas ANTES que las genéricas con parámetros
router.delete('/:boardId/todos/clear-completed', 
    validateBoardId,
    requireBoardEditPermission, 
    todoController.clearCompletedTodos.bind(todoController)
);

router.get('/:boardId/todos/:id', validateTodoId, requireBoardViewPermission, todoController.getTodoById.bind(todoController));
router.put('/:boardId/todos/:id', validateTodoId, validateTodoCreation, requireBoardEditPermission, todoController.updateTodo.bind(todoController));
router.patch('/:boardId/todos/:id/toggle', validateTodoId, requireBoardEditPermission, todoController.toggleTodo.bind(todoController));
router.delete('/:boardId/todos/:id', validateTodoId, requireBoardEditPermission, todoController.deleteTodo.bind(todoController));

export default router;