import { Request, Response } from 'express';
import { agregarTablero, listarTableros, eliminarTablero, obtenerTablero, obtenerTableroPorId} from '../services/tablerosService';

// GET /tableros - Listar todos los tableros
export async function getTableros(req: Request, res: Response) {
  try {
    const tableros = await listarTableros();
    
    res.json({ tableros });
  } catch (error) {
    console.error('Error al obtener tableros:', error);
    res.status(500).json({ error: "Error al obtener tableros" });
  }
}

// POST /tableros - Crear nuevo tablero
export async function createTablero(req: Request, res: Response) {
  try {
    const { nombre, alias } = req.body;
    
    if (!nombre || !alias) {
      return res.status(400).json({ 
        error: "Nombre y alias son requeridos" 
      });
    }

    const nuevoTablero = await agregarTablero(nombre.trim(), alias.trim());
    
    if (!nuevoTablero) {
      return res.status(400).json({ 
        error: "El tablero ya existe" 
      });
    }

    res.status(201).json({ success: true, tablero: nuevoTablero });
  } catch (error) {
    console.error('Error al crear tablero:', error);
    res.status(500).json({ error: "Error al crear tablero" });
  }
}

// GET /tableros/:alias - Obtener tablero por alias
export async function getTableroPorAlias(req: Request, res: Response) {
  try {
    const { alias } = req.params;
    
    if (!alias) {
      return res.status(400).json({ error: "Alias requerido" });
    }

    const tablero = await obtenerTablero(alias);
    
    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    res.json({ tablero });
  } catch (error) {
    console.error('Error al obtener tablero:', error);
    res.status(500).json({ error: "Error al obtener tablero" });
  }
}

// GET /tableros/id/:id - Obtener tablero por ID
export async function getTableroPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const tablero = await obtenerTableroPorId(id);
    
    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    res.json({ tablero });
  } catch (error) {
    console.error('Error al obtener tablero por ID:', error);
    res.status(500).json({ error: "Error al obtener tablero" });
  }
}

// DELETE /tableros/:alias - Eliminar tablero por alias
export async function deleteTablero(req: Request, res: Response) {
  try {
    const { alias } = req.params;
    
    if (!alias) {
      return res.status(400).json({ error: "Alias requerido" });
    }

    // Obtener el tablero por alias para conseguir el ID y datos completos
    const tablero = await obtenerTablero(alias);
    
    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    // Verificar que no sea un tablero protegido
    if (alias === "configuracion") {
      return res.status(403).json({ 
        error: "No se puede eliminar el tablero de configuración" 
      });
    }

    const eliminado = await eliminarTablero(tablero.id);
    
    if (!eliminado) {
      return res.status(500).json({ error: "Error al eliminar tablero" });
    }

    res.json({ 
      success: true, 
      mensaje: `Tablero "${tablero.nombre}" eliminado correctamente`,
      tablero: {
        id: tablero.id,
        alias: tablero.alias,
        nombre: tablero.nombre
      }
    });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: "Error al eliminar tablero" });
  }
}

// DELETE /tableros/id/:id - Eliminar tablero por ID (alternativo)
export async function deleteTableroPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    // Obtener datos del tablero antes de eliminar
    const tablero = await obtenerTableroPorId(id);
    
    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    // Verificar que no sea un tablero protegido
    if (tablero.alias === "configuracion") {
      return res.status(403).json({ 
        error: "No se puede eliminar el tablero de configuración" 
      });
    }

    const eliminado = await eliminarTablero(id);
    
    if (!eliminado) {
      return res.status(500).json({ error: "Error al eliminar tablero" });
    }

    res.json({ 
      success: true, 
      mensaje: `Tablero "${tablero.nombre}" eliminado correctamente`,
      tablero
    });
  } catch (error) {
    console.error('Error al eliminar tablero por ID:', error);
    res.status(500).json({ error: "Error al eliminar tablero" });
  }
}
