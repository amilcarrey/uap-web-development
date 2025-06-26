import { Request, Response } from 'express';
import { obtenerConfiguraciones, actualizarConfiguraciones, resetearConfiguraciones } from '../services/configuracionesService';

// GET /configuraciones - Obtener configuraciones actuales
export async function getConfiguraciones(req: Request, res: Response) {
  try {
    const configuraciones = await obtenerConfiguraciones();
    
    res.json({ configuraciones });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: "Error al obtener configuraciones" });
  }
}

// PUT /configuraciones - Actualizar configuraciones
export async function updateConfiguraciones(req: Request, res: Response) {
  try {
    const nuevasConfiguraciones = req.body;
    
    // Validar que se envió algo
    if (!nuevasConfiguraciones || Object.keys(nuevasConfiguraciones).length === 0) {
      return res.status(400).json({ 
        error: "Debe proporcionar al menos una configuración para actualizar" 
      });
    }

    // Validar campos válidos
    const camposValidos = ['intervaloRefetch', 'descripcionMayusculas', 'tareasPorPagina'];
    const camposEnviados = Object.keys(nuevasConfiguraciones);
    const camposInvalidos = camposEnviados.filter(campo => !camposValidos.includes(campo));
    
    if (camposInvalidos.length > 0) {
      return res.status(400).json({ 
        error: `Campos inválidos: ${camposInvalidos.join(', ')}. Campos permitidos: ${camposValidos.join(', ')}` 
      });
    }

    // Validar tipos de datos
    if (nuevasConfiguraciones.intervaloRefetch !== undefined) {
      if (typeof nuevasConfiguraciones.intervaloRefetch !== 'number' || nuevasConfiguraciones.intervaloRefetch < 1) {
        return res.status(400).json({ 
          error: "intervaloRefetch debe ser un número mayor a 0" 
        });
      }
    }

    if (nuevasConfiguraciones.descripcionMayusculas !== undefined) {
      if (typeof nuevasConfiguraciones.descripcionMayusculas !== 'boolean') {
        return res.status(400).json({ 
          error: "descripcionMayusculas debe ser un valor booleano" 
        });
      }
    }

    if (nuevasConfiguraciones.tareasPorPagina !== undefined) {
      if (typeof nuevasConfiguraciones.tareasPorPagina !== 'number' || nuevasConfiguraciones.tareasPorPagina < 1) {
        return res.status(400).json({ 
          error: "tareasPorPagina debe ser un número mayor a 0" 
        });
      }
    }

    const configuracionesActualizadas = await actualizarConfiguraciones(nuevasConfiguraciones);
    
    res.json({ 
      success: true, 
      configuraciones: configuracionesActualizadas,
      mensaje: "Configuraciones actualizadas correctamente"
    });
  } catch (error) {
    console.error('Error al actualizar configuraciones:', error);
    res.status(500).json({ error: "Error al actualizar configuraciones" });
  }
}

// POST /configuraciones/reset - Resetear configuraciones a valores por defecto
export async function resetConfiguraciones(req: Request, res: Response) {
  try {
    const configuracionesReseteadas = await resetearConfiguraciones();
    
    res.json({ 
      success: true, 
      configuraciones: configuracionesReseteadas,
      mensaje: "Configuraciones reseteadas a valores por defecto"
    });
  } catch (error) {
    console.error('Error al resetear configuraciones:', error);
    res.status(500).json({ error: "Error al resetear configuraciones" });
  }
}