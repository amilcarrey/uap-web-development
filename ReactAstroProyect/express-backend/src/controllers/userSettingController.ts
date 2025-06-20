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
    const settings = await getAllUserSettings(user.id);
    res.json(settings);
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

export const updateUserSettingHandler = async (req: Request, res: Response) => {
  const { settingKey, settingValue } = req.body;
  const user = req.user as { id: string };

  try {
    await updateUserSetting(user.id, settingKey, settingValue);
    res.status(200).json({ message: "Configuración actualizada exitosamente" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserSettingHandler = async (req: Request, res: Response) => {
  const { settingKey } = req.params;
  const user = req.user as { id: string };

  try {
    await removeUserSetting(user.id, settingKey);
    res.status(200).json({ message: "Configuración eliminada exitosamente" });
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