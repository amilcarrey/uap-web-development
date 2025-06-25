// routes/configRoutes.ts
import express from 'express';
import { guardarConfiguracion, obtenerConfiguracion } from '../controllers/configController';
import { verificarToken } from '../middlewares/verificarToken';

const router = express.Router();

router.get('/', verificarToken, obtenerConfiguracion);
router.put('/', verificarToken, guardarConfiguracion);

export default router;
