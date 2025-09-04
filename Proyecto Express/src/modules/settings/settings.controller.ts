import { Request, Response } from "express";
import { SettingsService } from "./settings.service";

export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  getSettings = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;

    const settings = await this.settingsService.getSettings(userId);
    res.json(settings);
  };

  saveSettings = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { refetchInterval, uppercaseDescriptions } = req.body;

    await this.settingsService.saveSettings(userId, refetchInterval, uppercaseDescriptions);
    res.status(204).send();
  };
}
