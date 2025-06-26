import { database } from "../../db/connection";

export const SettingsRepository = {
  async getByUserId(userId: string) {
    const settings = await database.get<{ user_id: string; uppercaseDescriptions: boolean }>(
      "SELECT * FROM user_settings WHERE user_id = ?",
      [userId]
    );

    return (
      settings ?? {
        user_id: userId,
        uppercaseDescriptions: false,
      }
    );
  },

  async update(userId: string, changes: { uppercaseDescriptions?: boolean }) {
    const existing = await database.get(
      "SELECT * FROM user_settings WHERE user_id = ?",
      [userId]
    );

    if (existing) {
      await database.run(
        "UPDATE user_settings SET uppercaseDescriptions = ? WHERE user_id = ?",
        [changes.uppercaseDescriptions ?? false, userId]
      );
    } else {
      await database.run(
        "INSERT INTO user_settings (user_id, uppercaseDescriptions) VALUES (?, ?)",
        [userId, changes.uppercaseDescriptions ?? false]
      );
    }

    return this.getByUserId(userId);
  },
};
