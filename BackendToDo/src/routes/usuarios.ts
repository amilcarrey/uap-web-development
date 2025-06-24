import express from 'express';
import { 
    getUsuarios,
    createUsuario,
    loginUsuario,
    getUsuarioPorId,
    logoutUsuario,
    checkAuth
} from '../controllers/usuariosController';

const router = express.Router();

// GET /usuarios - Listar todos los usuarios
router.get('/', getUsuarios);

// POST /usuarios - Crear un nuevo usuario
router.post('/', createUsuario);

// POST /usuarios/login - Iniciar sesión
router.post('/login', loginUsuario);

// POST /usuarios/logout - Cerrar sesión
router.post('/logout', logoutUsuario);

// GET /usuarios/check-auth - Verificar autenticación
router.get('/check-auth');

// GET /usuarios/:id - Obtener usuario por ID
router.get('/:id', getUsuarioPorId);

export default router;