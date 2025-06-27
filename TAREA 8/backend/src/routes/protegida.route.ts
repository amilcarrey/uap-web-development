import { Router } from 'express';
import { rutaProtegida } from '../controllers/protegida.controller';
import { verificarToken } from '../middlewares/verificarToken';

const router = Router();

router.get('/protegida', verificarToken, rutaProtegida);

export default router;
