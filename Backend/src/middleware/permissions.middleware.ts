import { Request, Response, NextFunction } from "express";
import { TaskService } from "../modules/task/task.service";
import { BoardService } from "../modules/board/board.service";

export const canModifyTasks = (taskService: TaskService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔍 Middleware de permisos de tareas activado");
      console.log("🔍 URL:", req.originalUrl);
      console.log("🔍 Método:", req.method);
      
      const userId = req.user?.id;
      if (!userId) {
        console.log("⚠️ No se encontró usuario en la solicitud");
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      let boardId: string | null = req.params.boardId;
      
      try {
        if (!boardId && req.params.taskId) {
          console.log("🔍 Obteniendo boardId para taskId:", req.params.taskId);
          boardId = await taskService.getTaskBoardId(req.params.taskId);
          console.log("🔍 boardId obtenido:", boardId);
        }
      } catch (boardIdError) {
        console.error("❌ Error al obtener boardId:", boardIdError);
        res.status(500).json({ error: "Error al obtener información de la tarea" });
        return;
      }
      
      if (!boardId) {
        console.log("⚠️ No se pudo determinar el tablero");
        res.status(404).json({ error: "Tablero o tarea no encontrados" });
        return;
      }

      let userRole: string | null;
      try {
        console.log(`🔍 Verificando rol para usuario ${userId} en tablero ${boardId}`);
        userRole = await taskService.getUserBoardRole(userId, boardId);
        console.log("🔍 Rol obtenido:", userRole);
      } catch (roleError) {
        console.error("❌ Error al obtener rol:", roleError);
        res.status(500).json({ error: "Error al verificar permisos" });
        return;
      }
      
      if (!userRole) {
        console.log("⚠️ Usuario sin acceso al tablero");
        res.status(403).json({ error: "No tienes acceso a este tablero" });
        return;
      }

      if (userRole === 'viewer' || userRole === 'read') {
        console.log("⚠️ Permiso insuficiente:", userRole);
        res.status(403).json({ error: "No tienes permisos para modificar tareas en este tablero" });
        return;
      }

      console.log("✅ Permiso concedido con rol:", userRole);
      next();
    } catch (error) {
      console.error("❌ Error general en middleware de permisos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
};

export const canManageBoardUsers = (boardService: BoardService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔍 Middleware de permisos de gestión de usuarios activado");
      console.log("🔍 URL:", req.originalUrl);
      console.log("🔍 Método:", req.method);
      console.log("🔍 Parámetros:", req.params);
      console.log("🔍 req.user:", req.user);
      
      const userId = req.user?.id;
      if (!userId) {
        console.log("⚠️ No se encontró usuario en la solicitud");
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const boardId = req.params.id;
      if (!boardId) {
        console.log("⚠️ No se encontró ID del tablero");
        res.status(400).json({ error: "ID de tablero no especificado" });
        return;
      }

      let userRole: string | null;
      try {
        console.log(`🔍 Verificando rol para usuario ${userId} en tablero ${boardId}`);
        userRole = await boardService.getUserBoardRole(userId, boardId);
        console.log("🔍 Rol obtenido:", userRole);
      } catch (roleError) {
        console.error("❌ Error al obtener rol:", roleError);
        res.status(500).json({ error: "Error al verificar permisos" });
        return;
      }

      if (!userRole) {
        console.log("⚠️ Usuario sin acceso al tablero");
        res.status(403).json({ error: "No tienes acceso a este tablero" });
        return;
      }

      if (userRole !== 'owner') {
        console.log("⚠️ Usuario no es propietario del tablero");
        res.status(403).json({ 
          error: "Solo el propietario del tablero puede gestionar los usuarios" 
        });
        return;
      }

      console.log("✅ Usuario es propietario, permiso concedido");
      next();
    } catch (error) {
      console.error("❌ Error general en middleware de permisos de tablero:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
};