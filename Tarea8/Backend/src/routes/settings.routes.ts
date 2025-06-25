import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import * as settingsController from '../controllers/setting.controller'

const router = Router()

router.get('/', requireAuth, settingsController.getSettings)
router.put('/', requireAuth, settingsController.updateSettings)

export default router