import {
  crearTareaService,
  obtenerTareasService,
  eliminarTareaService,
  toggleTareaService,
  actualizarTareaService,
} from "../servieces/tareaServieces.js";

import { obtenerTareasFiltradas } from "../servieces/tareaServieces.js";

export async function crearTareaController(req, res) {
  try {
    const { nombre, tableroId } = req.body;
    if (!nombre || !tableroId) {
      return res
        .status(400)
        .json({ error: "Nombre y tableroId son requeridos" });
    }
    const nuevaTarea = await crearTareaService({ nombre, tableroId });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
}

export async function obtenerTareasController(req, res) {
  try {
    const tableroId = req.params.tableroId;
    const filtro = req.query.filtro || "todos";

    console.log(
      `📋 Obteniendo tareas para tablero ${tableroId} con filtro ${filtro}`
    );

    if (!tableroId) {
      return res.status(400).json({ error: "TableroId es requerido" });
    }

    const tareas = await obtenerTareasService({ tableroId, filtro });
    console.log(`✅ Encontradas ${tareas.length} tareas`);

    res.status(200).json({ tareas }); // Cambio: envolver en objeto
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
}

export async function eliminarTareaController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de tarea es requerido" });
    }

    const eliminado = await eliminarTareaService(id);
    if (eliminado) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
}

export async function toggleTareaController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de tarea es requerido" });
    }

    const tareaActualizada = await toggleTareaService(id);
    if (tareaActualizada) {
      res.status(200).json(tareaActualizada);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    console.error("Error al cambiar estado de tarea:", error);
    res.status(500).json({ error: "Error al cambiar estado de tarea" });
  }
}

export async function actualizarTareaController(req, res) {
  try {
    const { id } = req.params;
    const { nombre, completada } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID de tarea es requerido" });
    }

    const tareaActualizada = await actualizarTareaService(id, {
      nombre,
      completada,
    });

    if (tareaActualizada) {
      res.status(200).json(tareaActualizada);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
}

export async function obtenerTareasFiltradasController(req, res) {
  try {
    const { tableroId } = req.params;
    const { pagina, limite, filtro } = req.query;

    if (!tableroId) {
      return res.status(400).json({ error: "TableroId es requerido" });
    }

    const tareas = await obtenerTareasFiltradas({
      tableroId,
      pagina: parseInt(pagina, 10) || 1,
      limite: parseInt(limite, 10) || 10,
      filtro,
    });

    res.status(200).json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas filtradas:", error);
    res.status(500).json({ error: "Error al obtener tareas filtradas" });
  }
}
