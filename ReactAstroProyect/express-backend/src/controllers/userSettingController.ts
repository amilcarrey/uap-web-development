import { Request, Response } from "express";
import { 
  getAllUserSettings,
  createUserSetting,
  updateUserSetting,
  removeUserSetting,
  getUserSettingByKey
} from "../services/userSettings.js";


export const getUserSettingsHandler = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string };
    const settingsArray = await getAllUserSettings(user.id);
    
    const settingsObject = settingsArray.reduce((acc: { [key: string]: string }, setting: { settingKey: string; settingValue: string }) => {
      acc[setting.settingKey] = setting.settingValue;
      return acc;
    }, {});
    
    const defaultSettings: { [key: string]: string } = {
      uppercaseDescriptions: "false",
      refetchInterval: "30", // segundos
      tasksPerPage: "7",
    };

    const finalSettings = { ...defaultSettings, ...settingsObject };
    
    res.json(finalSettings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addUserSettingHandler = async (req: Request, res: Response) => {
  const { settingKey, settingValue } = req.body;
  const user = req.user as { id: string };

  try {
    await createUserSetting(user.id, settingKey, settingValue);
    res.status(201).json({ message: "Configuración agregada exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};


// Podemos modficar multiples configuraciones de usuario
export const updateUserSettingHandler = async (req: Request, res: Response) => {
  const user = req.user as { id: string };

  try {
    //  DETECTAR si es una configuración individual o múltiple
    if (req.body.settingKey && req.body.settingValue) {
      // FORMATO INDIVIDUAL: { settingKey: "tasksPerPage", settingValue: "10" }
      const { settingKey, settingValue } = req.body;
      await updateUserSetting(user.id, settingKey, settingValue);
      res.status(200).json({ message: "Configuración actualizada exitosamente" });
    } else {
      // FORMATO MÚLTIPLE: { uppercaseDescriptions: "true", refetchInterval: "60", tasksPerPage: "10" }
      for (const [key, value] of Object.entries(req.body)) {
        await updateUserSetting(user.id, key, value as string);
      }
      res.status(200).json({ message: "Configuraciones actualizadas exitosamente" });
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserSettingHandler = async (req: Request, res: Response) => {
  const { settingKey } = req.params;
  const user = req.user as { id: string };

  try {
    if (settingKey === "all") {
      // RESET TODAS: DELETE /api/userSettings/all
      const currentSettings = await getAllUserSettings(user.id);
      for (const setting of currentSettings) {
        await removeUserSetting(user.id, setting.settingKey);
      }
      res.status(200).json({ message: "Todas las configuraciones han sido restablecidas" });
    } else {
      // ELIMINAR UNA: DELETE /api/userSettings/theme
      await removeUserSetting(user.id, settingKey);
      res.status(200).json({ message: "Configuración eliminada exitosamente" });
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const getUserSettingHandler = async (req: Request, res: Response) => {
  const { settingKey } = req.params;
  const user = req.user as { id: string };

  try {
    const setting = await getUserSettingByKey(user.id, settingKey);
    if (!setting) {
      res.status(404).json({ error: "Configuración no encontrada" });
      return;
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};