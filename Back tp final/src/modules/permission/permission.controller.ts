import {Response , Request} from 'express';
import {PermissionService} from './permission.service';

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  getAllPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const permissions = await this.permissionService.getAllPermissions();
      res.json({ permissions });
    } catch (error) {
      console.error("Error getting permissions:", error);
      res.status(500).json({ error: "Failed to retrieve permissions" });
    }
  };

  getPermissionsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const user_id = req.user?.id;
      if (!user_id) {
        res.status(401).json({ error: "Falta el user Id" });
        return;
      }
      const permissions = await this.permissionService.getPermissionsByUserId(user_id);
      if (permissions.length === 0) {
        res.status(404).json({ error: "No permissions found for this user" });
        return;
      }
      res.json({ permissions });
    } catch (error) {
      console.error("Error getting permissions by user ID:", error);
      res.status(500).json({ error: "Failed to retrieve permissions" });
    }
  };

  getPermissionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const permission = await this.permissionService.getPermissionById(id);
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
        return;
      }
      res.json({ permission });
    } catch (error) {
      console.error("Error getting permission:", error);
      res.status(500).json({ error: "Failed to retrieve permission" });
    }
  };

    createPermission = async (req: Request, res: Response): Promise<void> => {
        try {
        const permissionData = req.body;
        if (!permissionData || !permissionData.user_id || !permissionData.board_id || !permissionData.access_level) {
            res.status(400).json({ error: "Invalid permission data" });
            return;
        }
        const permission = await this.permissionService.createPermission(permissionData);
        res.status(201).json({ permission });
        } catch (error) {
        console.error("Error creating permission:", error);
        res.status(500).json({ error: "Failed to create permission" });
        }
    };

    changeAccessLevel = async (req: Request, res: Response): Promise<void> => {
        try {
        const { id } = req.params;
        const { access_level } = req.body;

        if (!id || !access_level) {
            res.status(400).json({ error: "Invalid request data" });
            return;
        }

        const updatedPermission = await this.permissionService.changeAccessLevel(id, access_level);
        if (!updatedPermission) {
            res.status(404).json({ error: "Permission not found" });
            return;
        }

        res.json({ updatedPermission });
        } catch (error) {
        console.error("Error changing access level:", error);
        res.status(500).json({ error: "Failed to change access level" });
        }
    }

    removePermission = async (req: Request, res: Response): Promise<void> => {
        try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Permission ID is required" });
            return;
        }

        const deleted = await this.permissionService.deletePermission
        if (!deleted) {
            res.status(404).json({ error: "Permission not found" });
            return;
        }

        res.status(204).send();
        } catch (error) {
        console.error("Error removing permission:", error);
        res.status(500).json({ error: "Failed to remove permission" });
        }
    }
}