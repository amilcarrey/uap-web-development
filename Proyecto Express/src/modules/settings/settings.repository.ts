import { database } from "../../db/connections";

export class SettingsRepository {
  async getSettingsByUserId(userId: string): Promise<{ refetchInterval: number, uppercaseDescriptions: boolean }> {
    const result = await database.get<{ refetchInterval?: number, uppercaseDescriptions?: boolean }>(
      "SELECT refetch_interval as refetchInterval, uppercase_descriptions as uppercaseDescriptions FROM settings WHERE user_id = ?",
      [userId]
    );

    return {
      refetchInterval: result?.refetchInterval ?? 10000,
      uppercaseDescriptions: result?.uppercaseDescriptions ?? false
    };
  }

  async saveSettings(userId: string, refetchInterval: number, uppercaseDescriptions: boolean): Promise<void> {
    await database.run(
      `INSERT INTO settings (user_id, refetch_interval, uppercase_descriptions)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         refetch_interval = excluded.refetch_interval,
         uppercase_descriptions = excluded.uppercase_descriptions`,
      [userId, refetchInterval, uppercaseDescriptions]
    );
  }
}
