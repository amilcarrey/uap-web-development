import { Request, Response } from 'express';
import { 
  listarTareas, 
  agregarTarea, 
  actualizarEstado, 
  eliminarTarea, 
  eliminarCompletadas,
  actualizarDescripcion 
} from '../services/tareasService';

// GET /tareas - Listar tareas con filtros y paginación
export async function getTareas(req: Request, res: Response) {
  try {
    const { idTablero, filtro, pagina = "1", limite = "5" } = req.query;
    
    if (!idTablero) {
      return res.status(400).json({ error: "idTablero es requerido" });
    }

    // Console.log para verificar el refetch automatico
    console.log(`🔄 [${new Date().toLocaleTimeString()}] GET /tareas - Refetch automático`);
    
    const paginaNum = parseInt(pagina as string);
    const limiteNum = parseInt(limite as string);
    const filtroValido = filtro as "completadas" | "pendientes" | undefined;

    // Obtener tareas del tablero específico
    const todasLasTareas = await listarTareas(idTablero as string, filtroValido);
    
    // Calcular paginación
    const totalTareas = todasLasTareas.length;
    const totalPaginas = Math.ceil(totalTareas / limiteNum);
    const inicio = (paginaNum - 1) * limiteNum;
    const fin = inicio + limiteNum;
    
    // Obtener tareas de la página actual
    const tareas = todasLasTareas.slice(inicio, fin);

    const response = {
      tareas,
      totalPaginas,
      paginaActual: paginaNum,
      totalTareas,
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
}

// POST /tareas - Agregar nueva tarea
export async function createTarea(req: Request, res: Response) {
  try {
    const { descripcion, idTablero } = req.body;

    if (!descripcion || !idTablero) {
      return res.status(400).json({ 
        error: "Descripción e idTablero son requeridos" 
      });
    }

    const nuevaTarea = await agregarTarea(descripcion.trim(), idTablero);

    if (!nuevaTarea) {
      return res.status(400).json({ 
        error: "La tarea ya existe en este tablero" 
      });
    }

    res.status(201).json({ success: true, tarea: nuevaTarea });
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    res.status(500).json({ error: "Error al agregar tarea" });
  }
}

// PUT /tareas/:id/toggle - Cambiar estado completada/pendiente
export async function toggleTarea(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // COMENTAR VERIFICACIONES DE PERMISOS TEMPORALMENTE:
    // const tarea = await obtenerTareaPorId(parseInt(id));
    // const tienePermiso = await verificarPermisoTablero(req.userId!, tarea.idTablero);
    // if (!tienePermiso) return res.status(403).json({ error: "Sin permisos" });
    
    const resultado = await actualizarEstado(parseInt(id));
    
    if (!resultado) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    
    res.json({ success: true, tarea: resultado });
  } catch (error) {
    console.error('Error al cambiar estado de tarea:', error);
    res.status(500).json({ error: "Error al cambiar estado de tarea" });
  }
}

// DELETE /tareas/:id - Eliminar tarea específica
export async function deleteTarea(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido o faltante" });
    }

    const eliminada = await eliminarTarea(id);

    if (!eliminada) {
      return res.status(400).json({ 
        success: false, 
        error: "No se pudo eliminar la tarea (inexistente)" 
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
}

// DELETE /tareas/completadas - Eliminar todas las tareas completadas
export async function deleteCompletadas(req: Request, res: Response) {
  try {
    const { idTablero } = req.body;
    
    if (!idTablero) {
      return res.status(400).json({ error: "idTablero es requerido" });
    }

    const idsEliminados = await eliminarCompletadas(idTablero);
    
    res.json({
      success: true,
      mensaje: "Tareas completadas eliminadas",
      idsEliminados,
    });
  } catch (error) {
    console.error('Error al eliminar completadas:', error);
    res.status(500).json({ error: "Error al eliminar tareas completadas" });
  }
}

// PUT /tareas/:id - Actualizar descripción de tarea
export async function updateDescripcionTarea(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { descripcion } = req.body;

    if (!id || isNaN(id) || !descripcion || descripcion.trim() === "") {
      return res.status(400).json({ 
        error: "Datos inválidos: se requiere id y descripción válida" 
      });
    }

    const resultado = await actualizarDescripcion(id, descripcion.trim());

    if (!resultado) {
      return res.status(404).json({ error: "No se encontró la tarea" });
    }

    res.json({ 
      success: true, 
      message: "Tarea actualizada correctamente" 
    });
  } catch (error) {
    console.error('Error al actualizar descripción:', error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
}

// POST /tareas/filtro - Filtrar tareas (para compatibilidad con frontend actual)
export async function filtrarTareas(req: Request, res: Response) {
  try {
    const { filtro, idTablero } = req.body;

    if (!idTablero) {
      return res.status(400).json({ error: "idTablero es requerido" });
    }

    const filtroValido = filtro as "completadas" | "pendientes" | "todas" | undefined;
    let filtroParaService: "completadas" | "pendientes" | undefined;

    switch (filtroValido) {
      case "completadas":
        filtroParaService = "completadas";
        break;
      case "pendientes":
        filtroParaService = "pendientes";
        break;
      case "todas":
      default:
        filtroParaService = undefined;
        break;
    }

    const tareas = await listarTareas(idTablero, filtroParaService);

    res.json({ tareas });
  } catch (error) {
    console.error('Error al filtrar tareas:', error);
    res.status(500).json({ error: "Error al filtrar tareas" });
  }
}