import { Request, Response } from 'express'
import db from '../db'

// guarda la config del usuario logueado
export const guardarConfiguracion = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.usuario?.id
  const configuracion = req.body

  // si no hay usuario, chau
  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  // guardo la config como json en la base
  db.prepare(`UPDATE usuarios SET configuracion_json = ? WHERE id = ?`)
    .run(JSON.stringify(configuracion), usuarioId)

  res.json({ mensaje: 'Configuración guardada' })
}

// trae la config del usuario logueado
export const obtenerConfiguracion = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.usuario?.id

  // si no hay usuario, chau
  if (!usuarioId) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  // busco la config en la base
  const row = db.prepare(`SELECT configuracion_json FROM usuarios WHERE id = ?`).get(usuarioId) as { configuracion_json?: string } | undefined
  const config = row?.configuracion_json ? JSON.parse(row.configuracion_json) : null

  res.json(config)
}
