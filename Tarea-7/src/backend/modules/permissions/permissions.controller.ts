import { RequestHandler } from "express";
import { PermissionsService } from "./permissions.service";

export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  assignPermission: RequestHandler = async (req, res) => {
    try {
      const { tableroId, usuarioId, nivel } = req.body;

      if (!tableroId || !usuarioId || !nivel) {
        res.status(400).json({ error: "tableroId, usuarioId y nivel son requeridos" });
        return;
      }

      await this.permissionsService.assignPermission(tableroId, usuarioId, nivel);
      res.status(200).json({ message: "Permiso asignado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error asignando permiso" });
    }
  };

  getUserPermission: RequestHandler = async (req, res) => {
    try {
      const { tableroId, usuarioId } = req.params;
      if (!tableroId || !usuarioId) {
        res.status(400).json({ error: "tableroId y usuarioId son requeridos" });
        return;
      }

      const permiso = await this.permissionsService.checkUserPermission(tableroId, usuarioId);
      if (!permiso) {
        res.status(404).json({ error: "Permiso no encontrado" });
        return;
      }

      res.json({ permiso });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener permiso" });
    }
  };

  getPermissionsByTablero: RequestHandler = async (req, res) => {
    try {
      const { tableroId } = req.params;
      if (!tableroId) {
        res.status(400).json({ error: "tableroId es requerido" });
        return;
      }

      const permisos = await this.permissionsService.getPermissionsByTablero(tableroId);
      res.json({ permisos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener permisos del tablero" });
    }
  };

  removePermission: RequestHandler = async (req, res) => {
    try {
      const { tableroId, usuarioId } = req.body;
      if (!tableroId || !usuarioId) {
        res.status(400).json({ error: "tableroId y usuarioId son requeridos" });
        return;
      }

      await this.permissionsService.removePermission(tableroId, usuarioId);
      res.status(200).json({ message: "Permiso eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando permiso" });
    }
  };
}
