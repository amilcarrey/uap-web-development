//Controller de las configuraciones del usuario
import { Response, Request } from "express";
import { UserSettingsService } from "./userSettings.service";

export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}


  getUserSettingsById = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('=== GET USER SETTINGS DEBUG ===');
      console.log('Request params:', req.params);
      console.log('Request user:', req.user);
      
      // const id = req.params.id;
      // if (!id) {
      //   console.log('ERROR: Missing id parameter');
      //   res.status(400).json({ error: "falta id" });
      //   return;
      // }
      const id = req.user?.id; // ← de la sesión/token

      console.log('Fetching settings for user:', id);
      const settings = await this.userSettingsService.getUserSettings(id);
      console.log('Settings retrieved:', settings);
      
      res.json({ settings });
    } catch (error) {
      console.error("Error getting user settings:", error);
      res.status(500).json({ error: "Failed to retrieve user settings" });
    }
  };

  createUserSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user_id;
      const settingsData = req.body;
    
      if (!userId) {
        res.status(401).json({ error: "falta id" });
        return;
      }

      const refreshInterval = req.body.refresh_interval || 60000;
      const showUppercase = req.body.show_uppercase || false;
      const taskPageSize = req.body.task_page_size || 10;
      console.log("Received settings data:", settingsData);

      if (!settingsData) {
        res.status(400).json({ error: "Settings data is required" });
        return;
      }

      const settings = await this.userSettingsService.createUserSettings(userId, refreshInterval, showUppercase, taskPageSize);
      res.status(201).json({ settings });
    } catch (error) {
       if (error instanceof Error) {
        res.status(500).json({ error: error.message || "No se pudo crear configuracionesss" });
      } else {
        res.status(500).json({ error: "No se pudo crear configuracionesss to login" });
      }
    }
  }

updateUserSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== UPDATE USER SETTINGS DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    const userId = req.user?.id; // ← de la sesión/token
    const refreshInterval = req.body.refresh_interval;
    const showUppercase = req.body.show_uppercase;
    const taskPageSize = req.body.task_page_size;
    
    console.log('Extracted values:', { userId, refreshInterval, showUppercase, taskPageSize });
    
    if (!userId) {
      console.log('ERROR: Usuario no autenticado');
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    if (
      refreshInterval === undefined &&
      showUppercase === undefined &&
      taskPageSize === undefined
    ) {
      console.log('ERROR: No hay campos para actualizar');
      res.status(400).json({ error: "Se requiere al menos un campo para actualizar" });
      return;
    }

    const updatedSettings = await this.userSettingsService.updateUserSettings(
      userId,
      refreshInterval,
      showUppercase,
      taskPageSize
    );

    console.log('Configuración actualizada correctamente:', updatedSettings);
    res.json({ settings: updatedSettings });

  } catch (error) {
    console.error("Error al actualizar configuraciones:", error);
    res.status(500).json({ error: "Error al actualizar configuraciones" });
  }
};

}