import express, {Request, Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', // Cambia al puerto de tu frontend si es otro
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (_req: Request, res: Response) => {
  res.send('API funcionando')
})
// Aquí irán tus rutas
// app.use('/api/auth', authRoutes)
// app.use('/api/boards', boardsRoutes)
// app.use('/api/tasks', tasksRoutes)
// app.use('/api/settings', settingsRoutes)

const PORT = process.env.PORT || 4321
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`)
})