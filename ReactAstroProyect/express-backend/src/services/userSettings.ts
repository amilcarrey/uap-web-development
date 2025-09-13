import { 
  getUserSettings as getUserSettingsModel,
  getUserEspecifcSetting,
  setUserSetting,
  deleteUserSetting,
  userSettingExists,
  UserSetting
} from "../models/userSettingsModel.js";

export async function getAllUserSettings(userId: string): Promise<UserSetting[]> {
  return await getUserSettingsModel(userId);
}

export async function createUserSetting(userId: string, settingKey: string, settingValue: string): Promise<void> {
  if (!settingKey || !settingValue) {
    throw new Error("La clave y el valor de la configuración son requeridos");
  }

  await setUserSetting(userId, settingKey, settingValue);
}

export async function updateUserSetting(userId: string, settingKey: string, settingValue: string): Promise<void> {
  if (!settingKey || !settingValue) {
    throw new Error("La clave y el valor de la configuración son requeridos");
  }

  await setUserSetting(userId, settingKey, settingValue);
}

export async function removeUserSetting(userId: string, settingKey: string): Promise<void> {
  if (!(await userSettingExists(userId, settingKey))) {
    throw new Error("La configuración no existe");
  }
  await deleteUserSetting(userId, settingKey);
}

export async function getUserSettingByKey(userId: string, settingKey: string): Promise<UserSetting | undefined> {
  return await getUserEspecifcSetting(userId, settingKey);
}

export async function checkUserSettingExists(userId: string, settingKey: string): Promise<boolean> {
  return await userSettingExists(userId, settingKey);
}