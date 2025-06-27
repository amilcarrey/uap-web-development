import { Router } from 'express';
import { verificarToken } from '../middlewares/verificarToken';
import { verificarAdmin } from '../middlewares/verificarAdmin';
import { listarUsuarios, estadisticasGenerales } from '../controllers/admin.controller';

const router = Router();


router.use(verificarToken);
router.use(verificarAdmin);


router.get('/usuarios', listarUsuarios);
router.get('/estadisticas', estadisticasGenerales);

export default router;
