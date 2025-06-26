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

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.post('/login', loginUsuario);
router.post('/logout', logoutUsuario);
router.get('/check-auth', checkAuth);
router.get('/:id', getUsuarioPorId);

export default router;