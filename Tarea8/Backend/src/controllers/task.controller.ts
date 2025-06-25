import { Response } from 'express'
import prisma from '../prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: 'No autenticado' })
        return
    }
    const { boardId, page = 1, limit = 10, filter, search } = req.query

    // Verifica permisos sobre el tablero
    const permission = await prisma.boardPermission.findUnique({
        where: { boardId_userId: { boardId: Number(boardId), userId } }
    })
    if (!permission) {
        res.status(403).json({ message: 'Sin permisos para ver tareas de este tablero' })
        return
    }

    // Filtros y paginación
    const where: any = { boardId: Number(boardId) }
    if (filter === 'completed') where.completed = true
    if (filter === 'active') where.completed = false
    if (search) where.title = { contains: search as string, mode: 'insensitive' }

    const totalCount = await prisma.task.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / Number(limit)))
    const currentPage = Number(page)

    const tasks = await prisma.task.findMany({
        where,
        skip: (currentPage - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
    })

    res.json({
        tasks,
        totalPages,
        currentPage
    })
}

// Implementá createTask, updateTask, deleteTask, clearCompleted siguiendo la misma lógica

export const createTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: 'No autenticado' })
        return
    }
    const { boardId, title } = req.body

    // Verifica permisos sobre el tablero
    const permission = await prisma.boardPermission.findUnique({
        where: { boardId_userId: { boardId: Number(boardId), userId } }
    })
    if (!permission || permission.role === 'viewer') {
        res.status(403).json({ message: 'Sin permisos para crear tareas en este tablero' })
        return
    }

    const task = await prisma.task.create({
        data: {
            title,
            boardId: Number(boardId),
            userId // Ahora sí, Prisma lo acepta
        }
    })
    res.status(201).json(task)
}


export const updateTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: 'No autenticado' })
        return
    }
    const { id } = req.params
    const { title, completed } = req.body

    // Busca la tarea
    const task = await prisma.task.findUnique({ where: { id: Number(id) } })
    if (!task) {
        res.status(404).json({ message: 'Tarea no encontrada' })
        return
    }

    // Chequea permisos en el tablero
    const permission = await prisma.boardPermission.findUnique({
        where: { boardId_userId: { boardId: task.boardId, userId } }
    })
    if (!permission || permission.role === 'viewer') {
        res.status(403).json({ message: 'Sin permisos para actualizar esta tarea' })
        return
    }

    const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: { title, completed }
    })
    res.json(updatedTask)
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: 'No autenticado' })
        return
    }
    const { id } = req.params

    const task = await prisma.task.findUnique({ where: { id: Number(id) } })
    if (!task) {
        res.status(404).json({ message: 'Tarea no encontrada' })
        return
    }

    // Chequea permisos en el tablero
    const permission = await prisma.boardPermission.findUnique({
        where: { boardId_userId: { boardId: task.boardId, userId } }
    })
    if (!permission || permission.role === 'viewer') {
        res.status(403).json({ message: 'Sin permisos para eliminar esta tarea' })
        return
    }

    await prisma.task.delete({ where: { id: Number(id) } })
    res.status(204).send()
}


export const clearCompleted = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: 'No autenticado' })
        return
    }
    const { boardId } = req.body

    // Verifica permisos sobre el tablero
    const permission = await prisma.boardPermission.findUnique({
        where: { boardId_userId: { boardId: Number(boardId), userId } }
    })
    if (!permission) {
        res.status(403).json({ message: 'Sin permisos para limpiar tareas completadas en este tablero' })
        return
    }

    await prisma.task.deleteMany({
        where: {
            boardId: Number(boardId),
            completed: true
        }
    })
    res.status(204).send()
}