// server/controllers/tarea.controller.js
import {
  obtenerTareasService,
  obtenerTareaPorIdService,
  crearTareaService,
  actualizarTareaService,
  eliminarTareaService,
  eliminarTareasCompletasService
} from "../servieces/tareaServieces.js";
import { obtenerRolService } from "../servieces/permisoServieces.js";

// 1) GET /api/tableros/:tablero_id/tareas
export const obtenerTareas = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const { page, limit, completada, search } = req.query;
    const tareas = await obtenerTareasService({
      tablero_id,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      completada,
      search
    });
    res.status(200).json(tareas);
  } catch (err) {
    console.error("Error al listar tareas:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 2) GET /api/tableros/:tablero_id/tareas/:id
export const obtenerTareaPorId = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const id = Number(req.params.id);
    const tarea = await obtenerTareaPorIdService(tablero_id, id);
    if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json(tarea);
  } catch (err) {
    console.error("Error al obtener tarea:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 3) POST /api/tableros/:tablero_id/tareas
export const crearTarea = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const usuario_id = req.usuario.id;
    const rol = await obtenerRolService(tablero_id, usuario_id);
    if (!["propietario","editor"].includes(rol)) {
      return res.status(403).json({ message: "Sin permisos para crear tareas" });
    }
    const { nombre } = req.body;
    const tarea = await crearTareaService({ nombre, tablero_id });
    res.status(201).json({ message: "Tarea creada", tarea });
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 4) PUT /api/tableros/:tablero_id/tareas/:id
export const actualizarTarea = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const id = Number(req.params.id);
    const usuario_id = req.usuario.id;
    const rol = await obtenerRolService(tablero_id, usuario_id);
    if (!["propietario","editor"].includes(rol)) {
      return res.status(403).json({ message: "Sin permisos para modificar tareas" });
    }
    const { nombre, completada } = req.body;
    const tarea = await actualizarTareaService(tablero_id, id, { nombre, completada });
    if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json({ message: "Tarea actualizada", tarea });
  } catch (err) {
    console.error("Error al actualizar tarea:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 5) DELETE /api/tableros/:tablero_id/tareas/completadas
export const eliminarTareasCompletas = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const usuario_id = req.usuario.id;
    const rol = await obtenerRolService(tablero_id, usuario_id);
    if (!["propietario","editor"].includes(rol)) {
      return res.status(403).json({ message: "Sin permisos para eliminar tareas completadas" });
    }
    const count = await eliminarTareasCompletasService(tablero_id);
    res.status(200).json({ message: `${count} tareas completadas eliminadas` });
  } catch (err) {
    console.error("Error al eliminar tareas completadas:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 6) DELETE /api/tableros/:tablero_id/tareas/:id
export const eliminarTarea = async (req, res) => {
  try {
    const tablero_id = Number(req.params.tablero_id);
    const id = Number(req.params.id);
    const usuario_id = req.usuario.id;
    const rol = await obtenerRolService(tablero_id, usuario_id);
    if (!["propietario","editor"].includes(rol)) {
      return res.status(403).json({ message: "Sin permisos para eliminar tareas" });
    }
    const ok = await eliminarTareaService(tablero_id, id);
    if (!ok) return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ message: "Error interno" });
  }
};
