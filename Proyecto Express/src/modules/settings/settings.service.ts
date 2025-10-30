import { SettingsRepository } from "./settings.repository";

export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  getSettings(userId: string) {
    return this.settingsRepository.getSettingsByUserId(userId);
  }

  saveSettings(userId: string, refetchInterval: number, uppercaseDescriptions: boolean) {
    return this.settingsRepository.saveSettings(userId, refetchInterval, uppercaseDescriptions);
  }
}
