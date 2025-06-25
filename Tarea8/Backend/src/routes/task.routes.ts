import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import * as taskController from '../controllers/task.controller'

const router = Router()

router.get('/', requireAuth, taskController.getTasks) // paginado, filtrado, búsqueda
router.post('/', requireAuth, taskController.createTask)
router.put('/:id', requireAuth, taskController.updateTask)
router.delete('/:id', requireAuth, taskController.deleteTask)
router.post('/clear-completed', requireAuth, taskController.clearCompleted)

export default router