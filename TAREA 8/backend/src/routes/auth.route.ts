import { Router } from 'express';
import { registroHandler, loginHandler, logoutHandler, perfilHandler } from '../controllers/auth.controller';
import { verificarToken } from '../middlewares/verificarToken';
import { validate, validationRules } from '../middlewares/validation';

const router = Router();

router.post('/register', validate(validationRules.registro), registroHandler);
router.post('/login', validate(validationRules.login), loginHandler);
router.post('/logout', logoutHandler);
router.get('/perfil', verificarToken, perfilHandler);

export default router;
