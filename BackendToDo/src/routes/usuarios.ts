import express from 'express';
import { 
    getUsuarios,
    createUsuario,
    loginUsuario,
    getUsuarioPorId,
    logoutUsuario
} from '../controllers/usuariosController';

const router = express.Router();
// GET /usuarios - Listar todos los usuarios
router.get('/', getUsuarios);

// POST /usuarios - Crear un nuevo usuario
router.post('/', createUsuario);

// POST /usuarios/login - Iniciar sesión
router.post('/login', loginUsuario);

// GET /usuarios/:id - Obtener usuario por ID
router.get('/:id', getUsuarioPorId);

// POST /usuarios/logout - Cerrar sesión
router.post('/logout', logoutUsuario);

export default router;