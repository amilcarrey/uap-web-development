import express, {Request, Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import prisma from './prisma'
import authRoutes from './routes/auth.routes'
import boardsRoutes from './routes/board.routes'
import settingsRoutes from './routes/settings.routes'
import tasksRoutes from './routes/task.routes'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/', async (_req: Request, res: Response) => {
  const userCount = await prisma.user.count()
  res.send(`API funcionando. Usuarios en la base: ${userCount}`)
})

// Aquí irán tus rutas
app.use('/api/boards', boardsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/settings', settingsRoutes)

const PORT = process.env.PORT || 4321
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`)
})