import { Response } from 'express'
import prisma from '../prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getBoards = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const boards = await prisma.board.findMany({
    where: {
      permissions: {
        some: { userId }
      }
    },
    include: { permissions: true }
  })
  res.json(boards)
}


export const createBoard = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const { name, description } = req.body

  if (!name || name.trim().length < 3) {
    res.status(400).json({ message: 'El nombre del tablero debe tener al menos 3 caracteres' })
    return
  }

  if (typeof userId !== 'number') {
    res.status(400).json({ message: 'Usuario no autenticado' })
    return
  }

  const board = await prisma.board.create({
    data: {
      name,
      description,
      ownerId: userId,
      permissions: {
        create: { userId: userId, role: 'owner' }
      }
    }
  })
  res.status(201).json(board)
}

export const getBoardById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const boardId = parseInt(req.params.id)
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      permissions: {
        include: { user: true }
      }
    }
  })
  if (!board || !board.permissions.some(p => p.userId === userId)) {
    res.status(404).json({ message: 'Tablero no encontrado' })
    return
  }
  res.json(board)
}

export const updateBoard = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const boardId = parseInt(req.params.id)
  const { name, description } = req.body

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { permissions: true }
  })

  if (!board || !board.permissions.some(p => p.userId === userId)) {
    res.status(404).json({ message: 'Tablero no encontrado' })
    return
  }

  const updatedBoard = await prisma.board.update({
    where: { id: boardId },
    data: { name, description }
  })

  res.json(updatedBoard)
}

export const deleteBoard = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const boardId = parseInt(req.params.id)

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { permissions: true }
  })

  if (!board || !board.permissions.some(p => p.userId === userId && p.role === 'owner')) {
    res.status(404).json({ message: 'Tablero no encontrado o sin permisos' })
    return
  }

  // Borrar tareas asociadas
  await prisma.task.deleteMany({ where: { boardId } })
  // Borrar permisos asociados
  await prisma.boardPermission.deleteMany({ where: { boardId } })
  // Borrar el tablero
  await prisma.board.delete({ where: { id: boardId } })

  res.json({ message: 'Tablero eliminado' })
}

export const shareBoard = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const boardId = parseInt(req.params.id)
  const { email, role } = req.body

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { permissions: true }
  })

  if (!board || !board.permissions.some(p => p.userId === userId && p.role === 'owner')) {
    res.status(404).json({ message: 'Tablero no encontrado o sin permisos' })
    return
  }


  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: 'Email inválido' })
    return
  }




  const userToShare = await prisma.user.findUnique({ where: { email } })
  if (!userToShare) {
    res.status(404).json({ message: 'Usuario no encontrado' })
    return
  }

  if (userToShare.id === userId) {
    res.status(400).json({ message: 'No puedes invitarte a ti mismo' })
    return
  }

  const existingPerm = await prisma.boardPermission.findUnique({
    where: { boardId_userId: { boardId, userId: userToShare.id } }
  })
  if (existingPerm) {
    res.status(400).json({ message: 'Ese usuario ya tiene acceso a este tablero' })
    return
  }

  if (!["editor", "viewer"].includes(role)) {
    res.status(400).json({ message: "Rol inválido" })
    return
  }

  await prisma.boardPermission.create({
    data: {
      boardId,
      userId: userToShare.id,
      role
    }
  })

  res.json({ message: 'Tablero compartido correctamente' })
  return
}

export const updateBoardPermission = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  if (typeof userId !== 'number') {
    res.status(400).json({ message: 'Usuario no autenticado' })
    return
  }
  const boardId = Number(req.params.id)
  const targetUserId = Number(req.params.userId)
  const { role } = req.body

  const ownerPerm = await prisma.boardPermission.findUnique({
    where: { boardId_userId: { boardId, userId } }
  })
  if (!ownerPerm || ownerPerm.role !== 'owner') {
    res.status(403).json({ message: 'Solo el propietario puede cambiar permisos' })
    return
  }

  const targetPerm = await prisma.boardPermission.findUnique({
    where: { boardId_userId: { boardId, userId: targetUserId } }
  })
  if (!targetPerm || targetPerm.role === 'owner') {
    res.status(400).json({ message: 'No se puede cambiar el rol del propietario' })
    return
  }

  if (!["editor", "viewer"].includes(role)) {
    res.status(400).json({ message: "Rol inválido" })
    return
  }


  await prisma.boardPermission.update({
    where: { boardId_userId: { boardId, userId: targetUserId } },
    data: { role }
  })

  res.json({ message: 'Permiso actualizado' })
}

export const removeBoardPermission = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  if (typeof userId !== 'number') {
    res.status(400).json({ message: 'Usuario no autenticado' })
    return
  }
  const boardId = Number(req.params.id)
  const targetUserId = Number(req.params.userId)

  const ownerPerm = await prisma.boardPermission.findUnique({
    where: { boardId_userId: { boardId, userId } }
  })
  if (!ownerPerm || ownerPerm.role !== 'owner') {
    res.status(403).json({ message: 'Solo el propietario puede quitar usuarios' })
    return
  }

  const targetPerm = await prisma.boardPermission.findUnique({
    where: { boardId_userId: { boardId, userId: targetUserId } }
  })
  if (!targetPerm || targetPerm.role === 'owner') {
    res.status(400).json({ message: 'No se puede quitar al propietario' })
    return
  }

  await prisma.boardPermission.delete({
    where: { boardId_userId: { boardId, userId: targetUserId } }
  })

  res.json({ message: 'Usuario quitado del tablero' })
}


