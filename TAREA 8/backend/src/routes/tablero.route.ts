import { Router } from 'express';
import { 
  crearTableroHandler, 
  obtenerTablerosHandler, 
  obtenerTableroHandler, 
  actualizarTableroHandler, 
  eliminarTableroHandler, 
  compartirTableroHandler, 
  eliminarPermisoHandler 
} from '../controllers/tablero.controller';
import { verificarToken } from '../middlewares/verificarToken';
import { verificarPropietario, verificarLector } from '../middlewares/authMiddleware';
import { validate, validationRules } from '../middlewares/validation';

const router = Router();


router.use(verificarToken);


router.post('/', validate(validationRules.tablero), crearTableroHandler);
router.get('/', obtenerTablerosHandler);
router.get('/:id', obtenerTableroHandler); 
router.put('/:id', verificarPropietario, validate(validationRules.tablero), actualizarTableroHandler);
router.delete('/:id', verificarPropietario, eliminarTableroHandler);


router.post('/:id/compartir', verificarPropietario, validate(validationRules.compartirTablero), compartirTableroHandler);
router.delete('/:id/permisos/:usuarioId', verificarPropietario, eliminarPermisoHandler);

export default router;
