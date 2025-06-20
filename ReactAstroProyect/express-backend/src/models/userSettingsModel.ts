import { database } from "../db.js";

export async function createUserSettingsTable(): Promise<void> {
  await database.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      settingKey TEXT NOT NULL,
      settingValue TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(userId, settingKey)
    )
  `);
}
//Todas las configuraciones de un usuario
export async function getUserSettings(userId: string) {
   return await database.all("SELECT * FROM user_settings WHERE userId = ?", [userId]);
}

// UNA configuración específica
// settingKey: Es el identificador único de la configuración ("theme", "autoRefresh")
export async function getUserEspecifcSetting(userId: string, settingKey: string) {
  return await database.get("SELECT * FROM user_settings WHERE userId = ? AND settingKey = ?", [userId, settingKey]);
}

export async function setUserSetting(userId: string, settingKey: string, settingValue: string): Promise<void> {
  await database.run(
    "INSERT OR REPLACE INTO user_settings (userId, settingKey, settingValue) VALUES (?, ?, ?)",
    [userId, settingKey, settingValue]
  );
}

export async function deleteUserSetting(userId: string, settingKey: string): Promise<void> {
  await database.run("DELETE FROM user_settings WHERE userId = ? AND settingKey = ?", [userId, settingKey]);
}

export async function userSettingExists(userId: string, settingKey: string): Promise<boolean> {
  const row = await database.get("SELECT 1 FROM user_settings WHERE userId = ? AND settingKey = ?", [userId, settingKey]);
  return !!row;
}