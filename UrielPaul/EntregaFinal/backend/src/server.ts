// src/server.ts
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupSwagger } from './swagger'

// Routers modulares
import { authRoutes }        from './routes/auth.routes'
import { boardRoutes }       from './routes/boards.routes'
import { taskRoutes }        from './routes/tasks.routes'
import { preferenceRoutes }  from './routes/preferences.routes'

const app = express()

/* ───── Middlewares globales ─────────────────────────────────────────── */
app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

/* ───── Rutas ─────────────────────────────────────────────────────────── */
authRoutes(app)
boardRoutes(app)
taskRoutes(app)
preferenceRoutes(app)

/* ───── Healthcheck ──────────────────────────────────────────────────── */
app.get('/ping', (_req, res) => {
  res.json({ ok: true })
})

/* ───── Swagger UI ───────────────────────────────────────────────────── */
setupSwagger(app)          // /docs

/* ───── Start server ─────────────────────────────────────────────────── */
app.listen(4000, () =>
  console.log('🚀 API lista en http://localhost:4000  (Swagger en /docs)')
)
