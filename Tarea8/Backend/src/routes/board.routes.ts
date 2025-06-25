import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import * as boardController from '../controllers/board.controller'
import { updateBoardPermission, removeBoardPermission } from '../controllers/board.controller'

const router = Router()

router.get('/', requireAuth, boardController.getBoards)
router.post('/', requireAuth, boardController.createBoard)
router.get('/:id', requireAuth, boardController.getBoardById)
router.put('/:id', requireAuth, boardController.updateBoard)
router.delete('/:id', requireAuth, boardController.deleteBoard)
router.post('/:id/share', requireAuth, boardController.shareBoard) 
router.put('/:id/permissions/:userId', requireAuth, boardController.updateBoardPermission)
router.delete('/:id/permissions/:userId', requireAuth, boardController.removeBoardPermission)


export default router