import { Response } from 'express'
import prisma from '../prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  if (!userId) {
    res.status(401).json({ message: 'No autenticado' })
    return
  }
  const settings = await prisma.userSetting.findUnique({ where: { userId } })
  res.json(settings)
}

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  if (!userId) {
    res.status(401).json({ message: 'No autenticado' })
    return
  }
  const { autoRefreshInterval, viewMode } = req.body
  const settings = await prisma.userSetting.upsert({
    where: { userId },
    update: { autoRefreshInterval, viewMode },
    create: { userId, autoRefreshInterval, viewMode }
  })
  res.json(settings)
}