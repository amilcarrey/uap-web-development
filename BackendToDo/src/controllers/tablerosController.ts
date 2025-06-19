import { Request, Response } from 'express';
import { agregarTablero, listarTableros, eliminarTablero, obtenerTablero, obtenerTableroPorId} from '../services/tablerosService';
import { 
  compartirTablero as compartirTableroService, 
  obtenerUsuariosConAcceso, 
  revocarAcceso, 
  esPropietarioTablero,
  obtenerUsuarioPorEmail
} from '../services/permisosService';


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
    const userId = (req as any).userId; 
    
    if (!nombre || !alias) {
      return res.status(400).json({ 
        error: "Nombre y alias son requeridos" 
      });
    }

    if (!userId) {
      return res.status(401).json({ 
        error: "Usuario no autenticado" 
      });
    }

    // Pasar userId como propietario
    const nuevoTablero = await agregarTablero(nombre.trim(), alias.trim(), userId);
    
    if (!nuevoTablero) {
      return res.status(400).json({ 
        error: "El tablero ya existe o error en creación" 
      });
    }

    res.status(201).json({ success: true, tablero: nuevoTablero });
  } catch (error) {
    console.error('❌ Error al crear tablero:', error); 
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

// POST /tableros/:id/compartir - Compartir tablero con otro usuario
export async function compartirTablero(req: Request, res: Response) {
  try {
    const { id: tableroId } = req.params;
    const { emailUsuario } = req.body;
    
    if (!emailUsuario) {
      return res.status(400).json({ 
        error: "Email del usuario es requerido" 
      });
    }

    // Buscar el usuario por email
    const usuario = await obtenerUsuarioPorEmail(emailUsuario.trim());
    
    if (!usuario) {
      return res.status(404).json({ 
        error: "Usuario no encontrado" 
      });
    }

    // Verificar que no sea el mismo propietario
    if (usuario.id === (req as any).userId) {
      return res.status(400).json({ 
        error: "No puedes compartir contigo mismo" 
      });
    }

    // Compartir el tablero
    const compartido = await compartirTableroService(tableroId, usuario.id);
    
    if (!compartido) {
      return res.status(500).json({ 
        error: "Error al compartir tablero" 
      });
    }

    res.json({ 
      success: true, 
      mensaje: `Tablero compartido con ${usuario.nombre} (${usuario.email})`,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error al compartir tablero:', error);
    res.status(500).json({ error: "Error al compartir tablero" });
  }
}

// GET /tableros/:id/usuarios - Listar usuarios con acceso al tablero
export async function obtenerUsuariosTablero(req: Request, res: Response) {
  try {
    const { id: tableroId } = req.params;
    
    const usuarios = await obtenerUsuariosConAcceso(tableroId);
    
    res.json({ 
      success: true, 
      usuarios: usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        esPropietario: u.esPropietario
      }))
    });
  } catch (error) {
    console.error('Error al obtener usuarios del tablero:', error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// DELETE /tableros/:id/acceso/:usuarioId - Revocar acceso a usuario
export async function revocarAccesoTablero(req: Request, res: Response) {
  try {
    const { id: tableroId, usuarioId } = req.params;
    
    // No permitir revocar acceso al propietario
    const esPropietario = await esPropietarioTablero(usuarioId, tableroId);
    if (esPropietario) {
      return res.status(400).json({ 
        error: "No se puede revocar acceso al propietario" 
      });
    }

    const revocado = await revocarAcceso(tableroId, usuarioId);
    
    if (!revocado) {
      return res.status(404).json({ 
        error: "Usuario no tenía acceso al tablero" 
      });
    }

    res.json({ 
      success: true, 
      mensaje: "Acceso revocado correctamente" 
    });
  } catch (error) {
    console.error('Error al revocar acceso:', error);
    res.status(500).json({ error: "Error al revocar acceso" });
  }
}
