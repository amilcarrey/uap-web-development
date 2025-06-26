import { Router } from 'express';
import { checkBoardPermission } from '../middleware/checkTableroPermiso';
import { authMiddleware } from '../middleware/auth.middleware';
import { BoardRepository } from '../modules/boards/board.repository';
import {
  getAllBoards,
  getBoardById,
  createBoard,
  deleteBoard
} from '../modules';


const router = Router();


router.use(authMiddleware); 
router.get('/', getAllBoards);
router.get('/:id', getBoardById);
router.post('/', createBoard);

// Eliminar un tablero (solo owner)
router.delete("/:id", checkBoardPermission(["owner"]), deleteBoard);

// Compartir un tablero con otro usuario
router.post("/:id/share", checkBoardPermission(["owner"]), async (req, res) => {
  const boardId = req.params.id;
  const { email, role = "viewer" } = req.body; // email en vez de userId

  if (!email) {
    return res.status(400).json({ error: "Falta el email del usuario" });
  }

  try {
    const user = await BoardRepository.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Prevenir duplicados
    const exists = await BoardRepository.hasPermission(boardId, user.id);
    if (exists) {
      return res.status(400).json({ error: "El usuario ya tiene acceso" });
    }

    await BoardRepository.addPermission(boardId, user.id, role);
    res.status(200).json({ message: "Permiso asignado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo compartir el tablero" });
  }
});

// Obtener lista de usuarios con permisos en un tablero
router.get("/:id/users", checkBoardPermission(["owner"]), async (req, res) => {
  const boardId = req.params.id;

  try {
    const users = await BoardRepository.getUsersWithPermissions(boardId);
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudieron obtener los usuarios con permisos" });
  }
});

export default router;